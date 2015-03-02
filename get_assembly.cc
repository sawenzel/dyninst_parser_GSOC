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

		//if(strcmp(f->name().c_str(), "main") == 0){
			cout << endl << "\"" << f->name() << "\" : [" << endl;
			//get address of entry point for current function
			Address crtaddr = f->entry()->start();
			do{
				//decode current instruction
				InstructionDecoder decoder(f->isrc()->getPtrToInstruction(crtaddr),
						InstructionDecoder::maxInstructionLength,
						f->region()->getArch());
				instr = decoder.decode();
				cout << "{address:\"" << hex << crtaddr << "\", ";
				cout << "name: \"" << instr->format() << "\"";

				//pentru instructiuni de tip call afisam adresa destinatie
				if(instr->getCategory() == 0 && instr->size() == 5){
					//aflam target-ul control flow-ului
					Expression::Ptr expr = instr->getControlFlowTarget();
					if(expr){
						std::vector<Expression::Ptr> children1;
						std::vector<Expression::Ptr> children2;
						expr->getChildren(children1);
						if(children1.size() > 0)
							children1[1]->getChildren(children2);

						//bind the RIP register value inside of the instruction
						//to that of the current address + size
						if(children1.size() > 0 && children2.size() > 0){
							expr->bind(children1[1].get(), Result(u32, crtaddr + instr->size()));
							//cout << " : " << expr->eval().format();

							//get the destination function
							Function *dest = co->findFuncByEntry(f->region(), expr->eval().convert<unsigned long int>());
							cout << ", dest: \"" << dest->name() << "\"";
						}
					}
				}
				//go to the address of the next instruction by adding the
				//size of the current instruction to the current address

				crtaddr += instr->size();
				cout << "}," << endl;
			} while(instr->getCategory() != 1);
			//decode instructions until return type instruction is found
			//i.e. category = 1
			cout << "]," << endl;
		}
	//}
}
