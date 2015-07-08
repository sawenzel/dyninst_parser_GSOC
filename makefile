all: get_binary functions run
get_binary: binary.c
	gcc binary.c -o binary
assembly: get_assembly.cc
	g++ -std=c++0x get_assembly.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
graph: get_graph.cc
	g++ -std=c++0x get_graph.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
functions: get_functions.cc
	g++ -std=c++0x get_functions.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
symparser: symparser.cc
	g++ -Wall -g -std=c++0x symparser.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
dynparser: dynparser.cc
	g++ -g -std=c++0x dynparser.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf -ldyninstAPI
draw: parser
	./parser binary | dot -Tpng > hello.png && go hello.png
run: parser
	./parser binary
clean:
	rm -f parser
