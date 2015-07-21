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

public class AssemblyServlet extends HttpServlet {
	private native String getAssemblyJni(String fileName);

	//local:
	//private static String binaryDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	//private static String cacheDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/cached-assembly/";

	//gsoc1:
	private static String binaryDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	private static String cacheDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/cached-assembly/";

	static {
		System.loadLibrary("dyninstParser");
	}

	private static Boolean isAssemblyCached(String fileName) {
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

	private static String getAssembly(String fileName) throws IOException {
		// if the functions are not cached, parse them and save them to cache
		if (isAssemblyCached(fileName) == false) {
			String binaryPath = binaryDirPath + fileName;

			String content;
			try {
				content = new AssemblyServlet().getAssemblyJni(binaryPath);
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
			System.out.println("usage: java AssemblyServlet <filename> <function name> <address>");
			return;
		}
		String fileName = args[0];
		String functionName = args[1];
		String address = args[2];

		if(isAssemblyCached(fileName) == false)
			getAssembly(fileName);

		Gson gson = new Gson();
		Type stringStringMap = new TypeToken<List<Map<String, String>>>(){}.getType();
		List<Map<String,String>> funcsList = gson.fromJson(new FileReader(cacheDirPath + fileName), stringStringMap);

		for(Map<String, String> i : funcsList){
			if(i.get(functionName) != null && i.get(functionName).contains(address)){
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
		String functionName = request.getParameter("functionname");
		String address = request.getParameter("address");

		if(isAssemblyCached(fileName) == false)
			getAssembly(fileName);

		Gson gson = new Gson();
		Type stringStringMap = new TypeToken<List<Map<String, String>>>(){}.getType();
		List<Map<String,String>> funcsList = gson.fromJson(new FileReader(cacheDirPath + fileName), stringStringMap);

		for(Map<String, String> i : funcsList){
			if(i.get(functionName) != null && i.get(functionName).contains(address)){
				response.getWriter().println(i.get(functionName));
				return;
			}
		}
	}
}
