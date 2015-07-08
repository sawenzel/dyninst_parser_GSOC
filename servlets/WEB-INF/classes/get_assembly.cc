#include <jni.h>
#include <stdio.h>
#include <map>
#include <vector>
#include <unordered_map>
#include <sstream>
#include <memory>
#include "CodeObject.h"
#include "InstructionDecoder.h"
#include "CFG.h"
#include "AssemblyServlet.h"

using namespace std;
using namespace Dyninst;
using namespace ParseAPI;
using namespace InstructionAPI;

JNIEXPORT jstring JNICALL Java_AssemblyServlet_getAssemblyJni
(JNIEnv * env, jobject obj, jstring jFileName){
	char *fileName = (char*) env->GetStringUTFChars(jFileName, 0);
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
		return env->NewStringUTF("error: file can not be parsed");
	}


	sts = new SymtabCodeSource(fileName);
	co = new CodeObject(sts);

	//parse the binary given as a command line arg
	co->parse();

	//get list of all functions in the binary
	const CodeObject::funclist &all = co->funcs();

	map<string, int> fmap;

	//iterate the ContainerWrapper through all the functions
	auto fit = all.begin();
	for(;fit != all.end(); ++fit){
		Function *f = *fit;

		//if the function exists, don't output it
		if(fmap.count(f->name()) != 0)
			continue;

		fmap[f->name()] = 1;

		//if(strcmp(f->name().c_str(), "main") == 0){
		outstream << endl << "\"" << f->name() << "\" : \"[" << endl;
		//get address of entry point for current function
		Address crtaddr = f->entry()->start();
		int instr_count = 0;
		do{
			if(instr_count != 0)
				outstream << ",";
			//decode current instruction
			InstructionDecoder decoder(f->isrc()->getPtrToInstruction(crtaddr),
					InstructionDecoder::maxInstructionLength,
					f->region()->getArch());
			instr = decoder.decode();
			outstream << endl << "{\\\"address\\\":\\\"" << hex << crtaddr << "\\\", ";
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
						expr->bind(children1[1].get(), Result(u32, crtaddr + instr->size()));
						//outstream << " : " << expr->eval().format();

						//get the destination function
						Function *dest = co->findFuncByEntry(f->region(), expr->eval().convert<unsigned long int>());
						//pt cazurile in care al doilea node al AST-ului nu era RIP
						if(dest)
							outstream << ", \\\"dest\\\": \\\"" << dest->name() << "\\\"";
					}
				}
			}
			//go to the address of the next instruction by adding the
			//size of the current instruction to the current address

			crtaddr += instr->size();
			outstream << "}";
			instr_count++;
		} while(instr->getCategory() != 1);
		//decode instructions until return type instruction is found
		//i.e. category = 1
		outstream << "]\"," << endl;
	}

	string resp = outstream.str();
	resp.pop_back();
	resp.pop_back();

	resp.insert(0, "{");
	resp.append("}");

	return env->NewStringUTF(resp.c_str());
}
