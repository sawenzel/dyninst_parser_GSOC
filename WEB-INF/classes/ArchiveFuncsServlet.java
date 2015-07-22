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

public class ArchiveFuncsServlet extends HttpServlet{
	private native String getArchiveFuncsJni(String fileName);

	//local:
	private static String binaryDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	private static String cacheDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/cached-archive-functions/";

	//gsoc1:
	//private static String binaryDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	//private static String cacheDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/cached-archive-functions/";

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
				content = new ArchiveFuncsServlet().getArchiveFuncsJni(binaryPath);
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
		if(args.length != 1){
			System.out.println("usage: java ArchiveServlet <file name>");
			return;
		}
		String fileName = args[0];

		System.out.println(getArchive(fileName));
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
	// Set response content type
	response.setContentType("application/json");

	String fileName = request.getParameter("filename");

	response.getWriter().println(getArchive(fileName));
	}
}
