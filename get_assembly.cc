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

	SymtabAPI::Symtab *symTab;
	std::string fileName(argv[1]);
	bool isParsable = SymtabAPI::Symtab::openFile(symTab, fileName);

	if(isParsable == false){
		cout<< "file can not be parsed";
		return -1;
	}

	sts = new SymtabCodeSource(argv[1]);
	co = new CodeObject(sts);

	//parse the binary given as a command line arg
	co->parse();

	const CodeObject::funclist &all = co->funcs();
	if(all.size() == 0){
		cout << "no functions" << endl;
		return -1;
	}

	Address crtAddr;

	vector<CodeRegion *> regions = co->cs()->regions();
	cout << regions.size() << endl;

	if(regions.size() == 0){
		cout << "no code regions" << endl;
		return -1;
	}

	auto crfit = regions.begin();
	for(;crfit != regions.end(); crfit++){
		CodeRegion* cr = *crfit;
		cout << hex << cr->low() << " " << hex << cr->high() << endl;
	}

	auto fit = all.begin();
	Function *f = *fit;
	InstructionDecoder decoder(f->isrc()->getPtrToInstruction(f->addr()), InstructionDecoder::maxInstructionLength, f->isrc()->getArch());

	for(; fit != all.end(); ++fit){
		f = *fit;
		crtAddr = f->addr();

		cout << f->name() << endl;;// << " " << hex << crtAddr << endl;

		instr = decoder.decode((const unsigned char*)f->isrc()->getPtrToInstruction(crtAddr));
		auto fbl = f->blocks().end();
		fbl--;
		Block *b = *fbl;
		Address lastAddr = b->last();
		while(crtAddr < lastAddr){
			cout << hex << crtAddr << " " << instr->format() << endl;

			instr = decoder.decode((const unsigned char*)f->isrc()->getPtrToInstruction(crtAddr));

			crtAddr += instr->size();
		}
	}
	/*
	InstructionDecoder decoder(co->cs()->getPtrToInstruction(crtAddr), 200, co->cs()->getArch());
	instr = decoder.decode();
	cout << instr->format();
*/
	/*
	//get list of all functions in the binary
	const CodeObject::funclist &all = co->funcs();

	//iterate the ContainerWrapper through all the functions
	auto fit = all.begin();
	for(;fit != all.end(); ++fit){
		Function *f = *fit;

		//if(strcmp(f->name().c_str(), "main") == 0){
			cout << endl << "\"" << f->name() << "\" : [" << endl;
			//get address of entry point for current function
			crtAddr = f->entry()->start();
			do{
				//decode current instruction
				InstructionDecoder decoder(f->isrc()->getPtrToInstruction(crtAddr),
						200,
						f->region()->getArch());
				instr = decoder.decode();
				cout << "{address:\"" << hex << crtAddr << "\", ";
				cout << "name: \"" << instr->format() << "\"";
				crtAddr += instr->size();
				cout << "}," << endl;
			}while(f->region()->contains(crtAddr) == true);
			//decode instructions until return type instruction is found
			//i.e. category = 1
			cout << "]," << endl;
		}
	}
	*/
}

