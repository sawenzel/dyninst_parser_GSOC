import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class FilesServlet extends HttpServlet {	
	public static void main(String[] args) {
		File baseDir = new File("gsoc-binaries");
		
//		files = baseDir.list();
		Gson gson = new Gson();
		System.out.println(gson.toJson(baseDir.list()));
		
//		for(String fileName: baseDir.list())
//			System.out.println(fileName);

		
		
//		@SuppressWarnings("unchecked")
//		Instr[] resArr = gson.fromJson(resp, Instr[].class);
		
//		for(Instr i: resArr)
//			System.out.println(i.address);

			
	}

	
	
	@Override
	public void init() throws ServletException {
		// TODO Auto-generated method stub
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		
		File baseDir = new File("/usr/local/apache-tomcat-8.0.23/webapps/ROOT/WEB-INF/classes/gsoc-binaries");
		
		Gson gson = new Gson();
		String result = gson.toJson(baseDir.list());
		
		response.getWriter().println(result);
	}

}
