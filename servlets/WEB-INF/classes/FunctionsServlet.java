import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;

import com.google.gson.Gson;

public class FunctionsServlet extends HttpServlet {
	private native String getFunctionsJni(String fileName);

	//local:
	private static String binaryDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	private static String cacheDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/cached-functions/";

	//gsoc1:
	//private static String binaryDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	//private static String cacheDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/cached-functions/";
	static {
		System.loadLibrary("dyninstParser");
	}

	private static Boolean isFunctionCached(String fileName) {
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

	private static String getFunctions(String fileName) throws IOException {
		// if the functions are not cached, parse them and save them to cache
		if (isFunctionCached(fileName) == false) {
			String binaryPath = binaryDirPath + fileName;

			String content;
			try {
				content = new FunctionsServlet().getFunctionsJni(binaryPath);
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
			System.out.println("usage: java FunctionsServlet <filename>");
			return;
		}
		System.out.println(getFunctions(args[0]));
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
	// Set response content type
	response.setContentType("application/json");

	response.getWriter().println(
			getFunctions(request.getParameter("filename")));
	}
}
