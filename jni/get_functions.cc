#include <jni.h>
#include <stdio.h>
#include <map>
#include <vector>
#include <unordered_map>
#include <sstream>
#include <memory>
#include "CodeObject.h"
#include "CFG.h"
#include "Parser.h"

using namespace std;
using namespace Dyninst;
using namespace ParseAPI;

JNIEXPORT jstring JNICALL Java_Parser_parse
	(JNIEnv * env, jobject obj, jstring jFileName){
	char *fileName = (char*) env->GetStringUTFChars(jFileName, 0);
	stringstream outstream;

	vector<Function *> funcs;
	SymtabCodeSource *sts;
	CodeObject *co;
	CodeRegion *cr;

	sts = new SymtabCodeSource(fileName);
	co = new CodeObject(sts);

	//parse the binary given as a command line arg
	co->parse();

	//get list of all functions in the binary
	const CodeObject::funclist &all = co->funcs();

	//iterate the ContainerWrapper
	auto fit = all.begin();
	for(int i=0; fit != all.end(); ++fit, i++){
		Function *f = *fit;
		outstream << "{address: \"" << hex << f->addr() << "\", name: \"" << f->name() << "\"}," << endl;
	}

	return env->NewStringUTF(outstream.str().c_str());
}
