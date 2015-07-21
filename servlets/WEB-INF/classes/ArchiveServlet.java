import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class ArchiveServlet extends HttpServlet{
	private native String getArchiveJni(String fileName);

	//local:
	//private static String binaryDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	//private static String cacheDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/cached-archive/";

	//gsoc1:
	private static String binaryDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	private static String cacheDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/cached-archives/";

	static {
		System.loadLibrary("dyninstParser");
	}

	class Pair<T1, T2>{
		public T1 first;
		public T2 second;

		public String toString(){
			return first.toString() + ":" + second.toString();
		}
	}

	/*
		 private static String getMd5(String path) throws IOException {
		 FileInputStream fis = new FileInputStream(new File(path));
		 String md5 = org.apache.commons.codec.digest.DigestUtils.md5Hex(fis);
		 fis.close();

		 return md5;
		 }
		 */

	private static Boolean isArchiveCached(String fileName) {
		File cacheDir = new File(cacheDirPath);
		String[] cachedBinaries = cacheDir.list();

		if(cachedBinaries == null)
			return false;

		for (String s : cachedBinaries) {
			if (s.compareTo(fileName) == 0) {
				return true;
			}
		}

		return false;
	}

	private static String getArchive(String fileName) throws IOException {
		// if the functions are not cached, parse them and save them to cache
		if (isArchiveCached(fileName) == false) {
			String binaryPath = binaryDirPath + fileName;

			String content;
			try {
				content = new ArchiveServlet().getArchiveJni(binaryPath);
				FileUtils.writeStringToFile(new File(cacheDirPath + fileName),
						content);
			} catch (Exception e) {
				return null;
			}
		}

		// return the cached result
		return FileUtils.readFileToString(new File(cacheDirPath + fileName));
	}

	public static void main(String[] args) throws IOException {
		if(args.length != 3){
			System.out.println("usage: java ArchiveServlet <file name> <object file name> <function name>");
			return;
		}
		String fileName = args[0];
		String objectName = args[1];
		String functionName = args[2];

		getArchive(fileName);

		Gson gson = new Gson();
		//{object_name : [{function_name:assembly}, ...]}
		Type stringStringMap = new TypeToken<Map<String, List<Map<String, String>>>>(){}.getType();
		Map<String, List<Map<String, String>>> map = gson.fromJson(new FileReader(cacheDirPath + fileName), stringStringMap);

		if(map.get(objectName) == null){
			System.out.println("No object file with that name");
			return;
		}

		List<Map<String, String>> funcsList = map.get(objectName);
		for(Map<String, String> i : funcsList){
			if(i.get(functionName) != null){
				System.out.println(i.get(functionName));
			}
		}
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
	// Set response content type
	response.setContentType("application/json");

	String fileName = request.getParameter("filename");
	String objectName = request.getParameter("objectname");
	String functionName = request.getParameter("functionname");
	String address = request.getParameter("address");

	if(isArchiveCached(fileName) == false)
		getArchive(fileName);

	Gson gson = new Gson();
	//{object_name : [{function_name:assembly}, ...]}
	Type stringStringMap = new TypeToken<Map<String, List<Map<String, String>>>>(){}.getType();
	Map<String, List<Map<String, String>>> map = gson.fromJson(new FileReader(cacheDirPath + fileName), stringStringMap);

	List<Map<String, String>> funcsList = map.get(objectName);
	for(Map<String, String> i : funcsList){
		if(i.get(functionName) != null && i.get(functionName).contains(address)){
			response.getWriter().println(i.get(functionName));
			return;
		}
	}
	}
}
