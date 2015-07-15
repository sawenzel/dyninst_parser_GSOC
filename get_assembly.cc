#include <stdio.h>
#include <map>
#include <vector>
#include <unordered_map>
#include <sstream>
#include <memory>
#include "CodeObject.h"
#include "InstructionDecoder.h"
#include "CFG.h"

using namespace std;
using namespace Dyninst;
using namespace ParseAPI;
using namespace InstructionAPI;

int main(int argc, char *argv[]){
	char *fileName = argv[1];
	stringstream outstream;

	vector<Function *> funcs;
	vector<Block *> blist;
	SymtabCodeSource *sts;
	CodeObject *co;
	CodeRegion *cr;
	Instruction::Ptr instr;

	SymtabAPI::Symtab *symTab;
	std::string fileNameStr(fileName);
	bool isParsable = SymtabAPI::Symtab::openFile(symTab, fileNameStr);

	if(isParsable == false){
		cout << "{\"error\": \"file can not be parsed\"}";
	}

	sts = new SymtabCodeSource(fileName);
	co = new CodeObject(sts);

	//parse the binary given as a command line arg
	co->parse();

	//get list of all functions in the binary
	const CodeObject::funclist &all = co->funcs();
	if(all.size() == 0){
		cout << "no functions";
		return -1;
	}

	Address crtAddr;

	auto fit = all.begin();
	Function *f = *fit;

	InstructionDecoder decoder(f->isrc()->getPtrToInstruction(f->addr()),
			InstructionDecoder::maxInstructionLength,
			f->region()->getArch());

	//iterate the ContainerWrapper through all the functions
	for(;fit != all.end(); ++fit){
		Function *f = *fit;

		//if(strcmp(f->name().c_str(), "printf") != 0)
			//continue;

		outstream << endl << "{\"" << f->name() << "\" : \"[" << endl;
		//get address of entry point for current function
		crtAddr = f->addr();
		int instr_count = 0;

		//InstructionDecoder decoder(f->isrc()->getPtrToInstruction(f->addr()),
			//InstructionDecoder::maxInstructionLength,
			//f->region()->getArch());
		instr = decoder.decode((unsigned char *)f->isrc()->getPtrToInstruction(crtAddr));
		auto fbl = f->blocks().end();
		fbl--;
		Block *b = *fbl;
		Address lastAddr = b->last();

		//cout << crtAddr << " " << lastAddr;

		while(crtAddr < lastAddr){
			if(instr_count != 0)
				outstream << ",";
			//decode current instruction
			instr = decoder.decode((unsigned char *)f->isrc()->getPtrToInstruction(crtAddr));

			//escaped slash and quotes because this will be parsed by GSON in Java
			outstream << endl << "{\\\"address\\\":\\\"" << hex << crtAddr << "\\\", ";
			outstream << "\\\"name\\\": \\\"" << instr->format() << "\\\"";

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
						expr->bind(children1[1].get(), Result(u32, crtAddr + instr->size()));
						//outstream << " : " << expr->eval().format();

						//get the destination function
						Function *dest = co->findFuncByEntry(f->region(), expr->eval().convert<unsigned long int>());
						//pt cazurile in care al doilea node al AST-ului nu era RIP
						if(dest){
							outstream << ", \\\"destName\\\": \\\"" << dest->name() << "\\\"";
							outstream << ", \\\"destAddr\\\": \\\"" << hex << dest->addr() << "\\\"";
						}
					}
				}
			}
			//go to the address of the next instruction by adding the
			//size of the current instruction to the current address

			crtAddr += instr->size();
			outstream << "}";
			instr_count++;
		};
		//decode instructions until return type instruction is found
		//i.e. category = 1
		outstream << "]\"}," << endl;
	}

	string resp = outstream.str();
	resp.pop_back();
	resp.pop_back();

	resp.insert(0, "[");
	resp.append("]");

	cout << resp.c_str();
}
