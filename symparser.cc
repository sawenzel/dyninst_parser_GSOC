#include <iostream>
#include "Symtab.h"
#include "Archive.h"
#include "CodeObject.h"
#include "CFG.h"
#include "InstructionDecoder.h"
#include "Instruction.h"
//#include "Function.h"

using namespace Dyninst;
using namespace SymtabAPI;
using namespace ParseAPI;
using namespace InstructionAPI;

int main(int argc, char **argv){
	Instruction::Ptr instr;

	Archive *ar = NULL;

	vector<Symtab *> symTabs;

	bool err = Archive::openArchive(ar, argv[1]);
	ar->getAllMembers(symTabs);

	cout << symTabs.size() << endl;

	map <string, int> fmap;

	auto fit = symTabs.begin();
	for(int i=0; fit != symTabs.end(); ++fit, i++){
		Symtab *s = *fit;
		SymtabCodeSource *sts = new SymtabCodeSource(s);

		CodeObject *co = new CodeObject(sts);

		co->parse();

		const CodeObject::funclist &all = co->funcs();

		//iterate the ContainerWrapper through all the functions
		auto fit = all.begin();
		for(;fit != all.end(); ++fit){
			ParseAPI::Function *f = *fit;
			//if the function exists, don't output it

			//if(strcmp(f->name().c_str(), "main") == 0){
			cout << endl << "\"" << f->name() << "\" : \"[" << endl;
			//get address of entry point for current function
			Address crtaddr = f->entry()->start();
			int instr_count = 0;
			do{
				if(instr_count != 0)
					cout << ",";
				//decode current instruction
				cout << f->isrc()->isValidAddress(crtaddr);
				InstructionDecoder decoder(f->isrc()->getPtrToInstruction(crtaddr),
						InstructionDecoder::maxInstructionLength,
						f->isrc()->getArch());

				instr = decoder.decode();

				cout << endl << "{\\\"address\\\":\\\"" << hex << crtaddr << "\\\", ";
				cout << "\\\"name\\\": \\\"" << instr->format() << "\\\"";
/*
				//pentru instructiuni de tip call afisam adresa destinatie
				if(instr->getCategory() == 0 && instr->size() == 5){
					//aflam target-ul control flow-ului
					Expression::Ptr expr = instr->getControlFlowTarget();
					if(expr){
						std::vector<Expression::Ptr> children1;
						std::vector<Expression::Ptr> children2;
						expr->getChildren(children1);
						if(children1.size() > 1)
							children1[1]->getChildren(children2);

						//bind the RIP register value inside of the instruction
						//to that of the current address + size
						if(children1.size() > 1 && children2.size() > 1){
							expr->bind(children1[1].get(), Result(u32, crtaddr + instr->size()));
							//cout << " : " << expr->eval().format();

							//get the destination function
							ParseAPI::Function *dest = co->findFuncByEntry(f->region(), expr->eval().convert<unsigned long int>());
							//pt cazurile in care al doilea node al AST-ului nu era RIP
							if(dest)
								cout << ", \\\"dest\\\": \\\"" << dest->name() << "\\\"";
						}
					}
				}
*/
				//go to the address of the next instruction by adding the
				//size of the current instruction to the current address

				crtaddr += instr->size();
				cout << "}";
				instr_count++;
			} while(instr->getCategory() != 1);
			//decode instructions until return type instruction is found
			//i.e. category = 1
			cout << "]\"," << endl;

		}
		}

		cout << err;
	}
