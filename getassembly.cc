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

		//region is the same for all functions
		//cout << f->region()->low() << " ";
		//cout << f->region()->high();

		//list assembly code for a function by name
		if(strcmp(f->name().c_str(), "main") == 0){
			cout<<"\nstart asm for " << f->name() << "\n\n";
			cout<<"address| size| ASM\n";
			Address crtaddr = f->entry()->start();
			do{
				InstructionDecoder decoder(f->isrc()->getPtrToInstruction(crtaddr),
						InstructionDecoder::maxInstructionLength,
						f->region()->getArch());
				instr = decoder.decode();
				cout << crtaddr << "|  " << instr->size() << "  | " << instr->format() << endl;
				crtaddr += instr->size();
			} while(instr->getCategory() != 1);
			cout<<"\n\nend asm\n\n";
		}

		//cout << f->name() << endl;
	}
}
