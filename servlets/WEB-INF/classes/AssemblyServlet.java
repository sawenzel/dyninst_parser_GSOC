import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

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

	/*
	private static String getMd5(String path) throws IOException {
		FileInputStream fis = new FileInputStream(new File(path));
		String md5 = org.apache.commons.codec.digest.DigestUtils.md5Hex(fis);
		fis.close();

		return md5;
	}
	*/

	private static Boolean isAssemblyCached(String fileName) {
		File cacheDir = new File(cacheDirPath);
		String[] cachedBinaries = cacheDir.list();

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

	class Instr{
		public String address, name, dest;
	}
	
	public static void main(String[] args) throws IOException {
		String fileName = args[0];
		getAssembly(fileName);

		Gson gson = new Gson();
		Type stringStringMap = new TypeToken<Map<String, String>>(){}.getType();
		Map<String,String> map = gson.fromJson(new FileReader(cacheDirPath + fileName), stringStringMap);
		
		System.out.println(map.get("_init"));
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// Set response content type
		response.setContentType("application/json");
		
		String fileName = request.getParameter("filename");

		if(isAssemblyCached(fileName) == false)
			getAssembly(fileName);
		
		Gson gson = new Gson();
		Type stringStringMap = new TypeToken<Map<String, String>>(){}.getType();
		Map<String,String> map = gson.fromJson(new FileReader(cacheDirPath + fileName), stringStringMap);
		
		response.getWriter().println(map.get(request.getParameter("functionname")));//.replace('\'', '\"'));
	}
}
