import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class FilesServlet extends HttpServlet {	
	//local:
	private static String binaryDirPath = "/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";

	//gsoc1:
	//private static String binaryDirPath = "/opt/tomcat8/webapps/ROOT/WEB-INF/classes/gsoc-binaries/";

	public static void main(String[] args) {
		File baseDir = new File("gsoc-binaries");
		Gson gson = new Gson();
		System.out.println(gson.toJson(baseDir.list()));
	}

	@Override
		public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
			response.setContentType("text/plain");

			File baseDir = new File(binaryDirPath);

			Gson gson = new Gson();
			String result = gson.toJson(baseDir.list());

			response.getWriter().println(result);
		}
}
