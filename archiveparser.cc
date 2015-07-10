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

	Archive::openArchive(ar, argv[1]);
	if(ar == NULL){
		//TODO: error message here
		cout << "empty archive" << endl;
		return -1;
	}
	ar->getAllMembers(symTabs);

	cout << symTabs.size() << endl;

	map <string, int> fmap;

	auto fit = symTabs.begin();
	for(int i=0; fit != symTabs.end(); ++fit, i++){
		Symtab *s = *fit;
		cout << "file: " << s->name() << endl;
		SymtabCodeSource *sts = new SymtabCodeSource(s);

		CodeObject *co = new CodeObject(sts);

		co->parse();

		vector<CodeRegion *> regions = co->cs()->regions();

		if(regions.size() == 0){
			cout << "no code regions" << endl;
			continue;
		}

		const CodeObject::funclist &all = co->funcs();
		if(all.size() == 0){
			cout << "no functions" << endl;
			continue;
		}
		cout << all.size();

		Address crtAddr;

		auto fitf = all.begin();
		ParseAPI::Function *f = *fitf;
		InstructionDecoder decoder(f->isrc()->getPtrToInstruction(f->addr()),
				InstructionDecoder::maxInstructionLength,
				f->isrc()->getArch());

		//iterate the ContainerWrapper through all the functions
		unsigned int findex = 0;
		for(;fitf != all.end(); ++fitf){
			ParseAPI::Function *f = *fitf;
			//if the function exists, don't output it

			//if(strcmp(f->name().c_str(), "main") == 0){
			cout << endl << "\"" << f->name() << "\" : \"[" << endl;
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
					cout << ",";
				//decode current instruction
				cout << f->isrc()->isValidAddress(crtAddr);

				instr = decoder.decode((unsigned char *)f->isrc()->getPtrToInstruction(crtAddr));

				cout << endl << "{\\\"address\\\":\\\"" << hex << crtAddr << "\\\", ";
				cout << "\\\"name\\\": \\\"" << instr->format() << "\\\"";

				crtAddr += instr->size();
				cout << "}";
				instr_count++;
			};
			//decode instructions until return type instruction is found
			//i.e. category = 1
			cout << "]\"," << endl;
			findex++;
		}
	}
}
