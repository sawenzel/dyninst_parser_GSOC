assembly:
	g++ -std=c++0x get_assembly.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
graph:
	g++ -std=c++0x get_graph.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
functions:
	g++ -std=c++0x get_functions.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
draw:
	./parser binary | dot -Tpng > hello.png && go hello.png
