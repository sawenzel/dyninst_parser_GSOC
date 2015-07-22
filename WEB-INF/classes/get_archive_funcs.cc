#include <jni.h>
#include <iostream>
#include "Symtab.h"
#include "Archive.h"
#include "CodeObject.h"
#include "CFG.h"
#include "InstructionDecoder.h"
#include "Instruction.h"
#include "ArchiveFuncsServlet.h"

using namespace Dyninst;
using namespace SymtabAPI;
using namespace ParseAPI;
using namespace InstructionAPI;

Address absDiff2(Address high, Address low){
	if(high < low)
		return low - high;
	return high - low;
}

JNIEXPORT jstring JNICALL Java_ArchiveFuncsServlet_getArchiveFuncsJni
(JNIEnv * env, jobject obj, jstring jFileName){
	char *fileName = (char*) env->GetStringUTFChars(jFileName, 0);
	Instruction::Ptr instr;
	Archive *ar = NULL;
	vector<Symtab *> symTabs;

	stringstream outstream;

	Archive::openArchive(ar, fileName);
	if(ar == NULL){
		return env->NewStringUTF("error: archive empty");
	}

	ar->getAllMembers(symTabs);

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

		Address crtAddr;

		auto fit = all.begin();
		ParseAPI::Function *f = *fit;
		InstructionDecoder decoder(f->isrc()->getPtrToInstruction(f->addr()),
				InstructionDecoder::maxInstructionLength,
				f->isrc()->getArch());

		//iterate the ContainerWrapper through all the functions
		for(;fit != all.end(); ++fit){
			ParseAPI::Function *f = *fit;
			//if the function exists, don't output it

			Address startAddr = f->addr();
			Address lastAddr;

			auto fbl = f->exitBlocks().end();
			if(f->exitBlocks().empty() == false){
				fbl--;
				Block *b = *fbl;
				lastAddr = b->last();
			} else {
				continue;
			}

			if(startAddr == lastAddr)
				continue;

			if(func_count != 0)
				outstream << ",\n";
			func_count++;

			outstream << "{\"address\": \"" << hex << f->addr() << "\",\"name\":\"" << f->name();
			outstream << "\",\"size\":\"" << dec << absDiff2(lastAddr, startAddr);
			outstream << "\",\"obj\":\"" << s->name() << "\"}";

		}
		if(func_count != 0)
			outstream << ",\n";
	}

	string resp = outstream.str();

	if(resp.size() == 0){
		return env->NewStringUTF("error: no functions parsed");
	}

	resp.pop_back();
	resp.pop_back();

	resp.insert(0, "[");
	resp.append("]");

	return env->NewStringUTF(resp.c_str());
}
