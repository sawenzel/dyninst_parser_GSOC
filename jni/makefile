all: headers compile run
functions:
	gcc -std=c++0x get_functions.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
headers:
	javac hello.java
	javah -jni hello
compile:
	#g++ -fPIC -I /usr/lib/jvm/java-7-openjdk-amd64/include/ -c hello.c
	#g++ -shared hello.o -o libhello.so
	g++ -fPIC -std=c++0x -I/usr/lib/jvm/java-7-openjdk-amd64/include/ -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c hello.c -L/usr/include/dwarf.h -ldwarf
	#-lparseAPI to resolve mangled c++ naming
	g++ -shared hello.o -o libhello.so -lparseAPI
run:
	java -Djava.library.path=. hello
