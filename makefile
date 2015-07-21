all: get_binary assembly graph functions symparser
get_binary: binary.c
	gcc binary.c -o binary
assembly: get_assembly.cc
	g++ -std=c++0x get_assembly.cc -o assembly -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
graph: get_graph.cc
	g++ -std=c++0x get_graph.cc -o graph -I/usr/include/dyninst -lsymtabAPI -lparseAPI -linstructionAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf -lsymtabAPI
functions: get_functions.cc
	g++ -std=c++0x -I/scratch/Dyninst-8.2.1/headers -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -c get_functions.cc -L/scratch/Dyninst-8.2.1/lib -ldwarf
	#g++ -std=c++0x get_functions.cc -o functions -I/usr/include/dyninst -lsymtabAPI -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf -lsymtabAPI 
archiveparser: archiveparser.cc
	g++ -Wall -std=c++0x archiveparser.cc -o archiveparser -I/usr/include/dyninst -lparseAPI -linstructionAPI -lsymtabAPI -lsymLite -ldynDwarf -ldynElf -lcommon -L/usr/include/dwarf.h -ldwarf
draw: parser
	./parser binary | dot -Tpng > hello.png && go hello.png
run: parser
	./parser binary
clean:
	rm -f binary assembly graph functions archiveparser *.class
