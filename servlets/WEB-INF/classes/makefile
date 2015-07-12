all: headers compile_arch_assembly compile_arch_functions compile_bin_functions compile_bin_assembly lib
headers: FunctionsServlet.java AssemblyServlet.java
	javac FilesServlet.java
	javac FunctionsServlet.java
	javah -jni FunctionsServlet
	javac AssemblyServlet.java
	javah -jni AssemblyServlet
	javac ArchiveServlet.java
	javah -jni ArchiveServlet
	javac ArchiveFuncsServlet.java
	javah -jni ArchiveFuncsServlet

#gsoc1:
#compile_functions: get_functions.cc
	#g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.79-2.5.5.2.el7_1.x86_64/include/ -I/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.79-2.5.5.2.el7_1.x86_64/include/linux -I/scratch/Dyninst-8.2.1/headers -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_functions.cc -L/scratch/Dyninst-8.2.1/lib -ldwarf
#compile_assembly: get_assembly.cc
	#g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.79-2.5.5.2.el7_1.x86_64/include/ -I/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.79-2.5.5.2.el7_1.x86_64/include/linux -I/scratch/Dyninst-8.2.1/headers -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_assembly.cc -L/scratch/Dyninst-8.2.1/lib -ldwarf

#local:
compile_bin_functions: get_functions.cc
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_functions.cc -L/usr/include/dwarf.h -ldwarf
compile_bin_assembly: get_assembly.cc
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_assembly.cc -L/usr/include/dwarf.h -ldwarf
compile_arch_assembly: get_archive.cc
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_archive.cc -L/usr/include/dwarf.h -ldwarf
compile_arch_functions: get_archive_funcs.cc
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_archive_funcs.cc -L/usr/include/dwarf.h -ldwarf
lib:
	#-lparseAPI to resolve mangled c++ naming
	g++ -shared get_assembly.o get_functions.o get_archive.o get_archive_funcs.o -o libdyninstParser.so -L/scratch/Dyninst-8.2.1/lib -lparseAPI
run:
	java -cp . -Djava.library.path=. Parser
clean:
	rm -f *.o *.so *.h *.class
