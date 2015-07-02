all: headers compile_functions compile_assembly lib
headers: FunctionsServlet.java AssemblyServlet.java
	javac FilesServlet.java
	javac FunctionsServlet.java
	javah -jni FunctionsServlet
	javac AssemblyServlet.java
	javah -jni AssemblyServlet
compile_functions: get_functions.cc
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_functions.cc -L/usr/include/dwarf.h -ldwarf
compile_assembly: get_assembly.cc
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_assembly.cc -L/usr/include/dwarf.h -ldwarf
lib:
	#-lparseAPI to resolve mangled c++ naming
	g++ -shared get_functions.o get_assembly.o -o libdyninstParser.so -lparseAPI
run:
	java -cp . -Djava.library.path=. Parser
clean:
	rm -f *.o *.so *.h *.class
