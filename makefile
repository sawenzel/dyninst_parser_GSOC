build:
	g++ -std=c++0x parser.cc -o parser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
draw:
	./parser binary | dot -Tpng > hello.png && go hello.png
