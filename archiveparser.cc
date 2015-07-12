#include <iostream>
#include "Symtab.h"
#include "Archive.h"
#include "CodeObject.h"
#include "CFG.h"
#include "InstructionDecoder.h"
#include "Instruction.h"

using namespace Dyninst;
using namespace SymtabAPI;
using namespace ParseAPI;
using namespace InstructionAPI;

int main(int argc, char **argv){
	Instruction::Ptr instr;
	Archive *ar = NULL;
	vector<Symtab *> symTabs;

	stringstream outstream;

	Archive::openArchive(ar, argv[1]);
	if(ar == NULL){
		outstream << "{empty archive}";
		return -1;
	}

	ar->getAllMembers(symTabs);

	outstream << "{";

	auto sit = symTabs.begin();
	for(; sit != symTabs.end(); ++sit){
		int func_count = 0;

		Symtab *s = *sit;
		SymtabCodeSource *sts = new SymtabCodeSource(s);

		CodeObject *co = new CodeObject(sts);

		co->parse();

		vector<CodeRegion *> regions = co->cs()->regions();

		if(regions.size() == 0){
			//no code regions
			continue;
		}

		const CodeObject::funclist &all = co->funcs();
		if(all.size() == 0){
			//no functions
			continue;
		}

		outstream << "\"" << s->name() << "\":{";

		Address crtAddr;

		auto fit = all.begin();
		ParseAPI::Function *f = *fit;
		InstructionDecoder decoder(f->isrc()->getPtrToInstruction(f->addr()),
				InstructionDecoder::maxInstructionLength,
				f->isrc()->getArch());

		//iterate the ContainerWrapper through all the functions
		for(;fit != all.end(); ++fit){
			if(func_count != 0)
				outstream << ",";
			func_count++;
			ParseAPI::Function *f = *fit;
			//if the function exists, don't output it

			//if(strcmp(f->name().c_str(), "main") == 0){
			outstream << "\n\"" << f->name() << "\": \"[";
			//get address of entry point for current function
			//Address crtAddr = f->entry()->start();
			crtAddr = f->addr();
			int instr_count = 0;

			instr = decoder.decode((unsigned char *)f->isrc()->getPtrToInstruction(crtAddr));
			auto fbl = f->blocks().end();
			fbl--;
			Block *b = *fbl;
			Address lastAddr = b->last();

			while(crtAddr < lastAddr){
				if(instr_count != 0)
					outstream << ",";
				//decode current instruction
				instr = decoder.decode((unsigned char *)f->isrc()->getPtrToInstruction(crtAddr));

				outstream << "\n\t{\\\"address\": \\\"" << hex << crtAddr << "\\\", ";
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
							ParseAPI::Function *dest = co->findFuncByEntry(f->region(), expr->eval().convert<unsigned long int>());
							//pt cazurile in care al doilea node al AST-ului nu era RIP
							if(dest)
								outstream << ", \\\"dest\\\": \\\"" << dest->name() << "\\\"";
						}
					}
				}
				//go to the address of the next instruction by adding the
				//size of the current instruction to the current address

				crtAddr += instr->size();
				outstream << "}";
				instr_count++;
			};
			outstream << "\"]";
		}
		outstream << "},";
		}

		string resp = outstream.str();
		resp.pop_back();
		resp.append("}");

		cout << resp;
	}
