<<<<<<< HEAD
all: headers compile_functions run
=======
all: headers compile_assembly run
>>>>>>> 8f10ac99db74586898296fd32dd941bfc1b11adf
headers: Parser.java
	javac Parser.java
	javah -jni Parser
compile_functions: get_functions.cc
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_functions.cc -L/usr/include/dwarf.h -ldwarf
	#-lparseAPI to resolve mangled c++ naming
	g++ -shared get_functions.o -o libdyninstParser.so -lparseAPI
compile_assembly: get_assembly.cc
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_assembly.cc -L/usr/include/dwarf.h -ldwarf
	#-lparseAPI to resolve mangled c++ naming
	g++ -shared get_assembly.o -o libdyninstParser.so -lparseAPI
run:
	java -Djava.library.path=. Parser
clean:
<<<<<<< HEAD
	rm -f *.0 *.so Parser.h Parser.class
=======
	rm -f *.0 *.so
>>>>>>> 8f10ac99db74586898296fd32dd941bfc1b11adf
