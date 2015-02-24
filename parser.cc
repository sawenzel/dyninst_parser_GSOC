#include<stdio.h>
#include<map>
#include<vector>
#include<unordered_map>
#include<sstream>
#include<memory>
#include "CodeObject.h"
#include "InstructionDecoder.h"
#include "CFG.h"

using namespace std;
using namespace Dyninst;
using namespace ParseAPI;
using namespace InstructionAPI;

int main(int argc, char *argv[]){
	vector<Function *> funcs;
	vector<Block *> blist;
	SymtabCodeSource *sts;
	CodeObject *co;
	CodeRegion *cr;
	Instruction::Ptr instr;

	sts = new SymtabCodeSource(argv[1]);
	co = new CodeObject(sts);

	//parse the binary given as a command line arg
	co->parse();

	//get list of all functions in the binary
	const CodeObject::funclist &all = co->funcs();

	//iterate the ContainerWrapper through all the functions
	auto fit = all.begin();
	for(;fit != all.end(); ++fit){
		Function *f = *fit;

		if(strcmp(f->name().c_str(), "func2") == 0){
			cout<<"\nASM for " << f->name() << "\n\n";
			cout<<"address| size| ASM\n";
			//get address of entry point for current function
			Address crtaddr = f->entry()->start();
			do{
				//decode current instruction
				InstructionDecoder decoder(f->isrc()->getPtrToInstruction(crtaddr),
						InstructionDecoder::maxInstructionLength,
						f->region()->getArch());
				instr = decoder.decode();
				cout << crtaddr << "|  " << instr->size() << "  | " << instr->format() << endl;
				//go to the address of the next instruction by adding the
				//size of the current instruction to the current address
				crtaddr += instr->size();
			} while(instr->getCategory() != 1);
			//decode instructions until return type instruction is found
			//i.e. category = 1
		}
	}
}
