import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class ArchiveFuncsServlet extends HttpServlet {
	private native String getArchiveFuncsJni(String fileName);

	// local:
	private static String binaryDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	private static String cacheDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/cached-archive-functions/";

	// gsoc1:
	// private static String binaryDirPath =
	// "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";
	// private static String cacheDirPath =
	// "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/cached-archive-functions/";

	static {
		System.loadLibrary("dyninstParser");
	}

	/*
	 * private static String getMd5(String path) throws IOException {
	 * FileInputStream fis = new FileInputStream(new File(path)); String md5 =
	 * org.apache.commons.codec.digest.DigestUtils.md5Hex(fis); fis.close();
	 * 
	 * return md5; }
	 */

	private static Boolean isArchiveCached(String fileName) {
		File cacheDir = new File(cacheDirPath);
		String[] cachedBinaries = cacheDir.list();

		if (cachedBinaries == null)
			return false;

		for (String s : cachedBinaries) {
			if (s.compareTo(fileName) == 0) {
				return true;
			}
		}

		return false;
	}

	class Func {
		private String address;
		private String name;
		private String obj;
		private int size;

		public String toString() {
			return String.format("'address': %s,'name':%s,'size':%d", address,
					name, size);
		}
	}


	private static String getFunctions(String fileName, String sortMode,
			final String sortDirection) throws IOException {
		// if the functions are not cached, parse them and save them to cache
		if (isArchiveCached(fileName) == false) {
			String binaryPath = binaryDirPath + fileName;

			String content;
			try {
				content = new ArchiveFuncsServlet()
					.getArchiveFuncsJni(binaryPath);
				FileUtils.writeStringToFile(new File(cacheDirPath + fileName),
						content);
			} catch (Exception e) {
				return null;
			}
		}
		// return the cached result
		String source = FileUtils.readFileToString(new File(cacheDirPath
					+ fileName));

		System.out.println(source);
		if(source.startsWith("error"))
			return source;

		Gson gson = new Gson();
		Type stringStringMap = new TypeToken<List<Func>>() {
		}.getType();
		List<Func> funcList = gson.fromJson(source, stringStringMap);

		if (sortMode.compareTo("size") == 0) {
			Collections.sort(funcList, new Comparator<Func>() {

				@Override
				public int compare(Func o1, Func o2) {
					if (sortDirection.compareTo("ascending") == 0) {
						return o1.size - o2.size;
					} else {
						return o2.size - o1.size;
					}
				}
			});
		} else if (sortMode.compareTo("name") == 0) {
			Collections.sort(funcList, new Comparator<Func>() {

				@Override
				public int compare(Func o1, Func o2) {
					if (sortDirection.compareTo("ascending") == 0) {
						return o1.name.compareTo(o2.name);
					} else {
						return o2.name.compareTo(o1.name);
					}
				}
			});
		} else if (sortMode.compareTo("address") == 0) {
			Collections.sort(funcList, new Comparator<Func>() {
				@Override
				public int compare(Func o1, Func o2) {
					Integer i1 = Integer.parseInt(o1.address, 16);
					Integer i2 = Integer.parseInt(o2.address, 16);
					if (sortDirection.compareTo("ascending") == 0) {
						return i1 - i2;
					} else {
						return i2 - i1;
					}
				}
			});
		} else if(sortMode.compareTo("objname") == 0){
			Collections.sort(funcList, new Comparator<Func>() {

				@Override
				public int compare(Func o1, Func o2) {
					if (sortDirection.compareTo("ascending") == 0) {
						return o1.obj.compareTo(o2.obj);
					} else {
						return o2.obj.compareTo(o1.obj);
					}
				}
			});
		}

		return gson.toJson(funcList);
	}

	public static void main(String[] args) throws IOException {
		if(args.length != 3){
			System.out.println("usage: java FunctionsServlet <filename> <sort by> <sort dir>");
			return;
		}

		System.out.println(getFunctions(args[0], args[1], args[2]));
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
	// Set response content type

	response.setContentType("text/plain");
	String sortMode = request.getParameter("sortby");
	String sortDirection = request.getParameter("sortdirection");
	String fileName = request.getParameter("filename");

	response.getWriter().println(getFunctions(fileName, sortMode, sortDirection));
	}
}