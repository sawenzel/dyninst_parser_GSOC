#include<stdio.h>
#include<map>
#include<vector>
#include<unordered_map>
#include<sstream>
#include<memory>
#include "CodeObject.h"
#include "CFG.h"
#include "Symtab.h"

using namespace std;
using namespace Dyninst;
using namespace ParseAPI;

int main(int argc, char *argv[]){
	vector<Function *> funcs;
	SymtabCodeSource *sts;
	CodeObject *co;
	CodeRegion *cr;

	SymtabAPI::Symtab *symTab;
	std::string fileName(argv[1]);
	bool isParsable = SymtabAPI::Symtab::openFile(symTab, fileName);

	if(isParsable == false){
		cout << "file can not be parsed";
		return -1;
	}

	sts = new SymtabCodeSource(argv[1]);
	if(sts == NULL)
		return -1;
	co = new CodeObject(sts);


	//parse the binary given as a command line arg
	co->parse();

	//get list of all functions in the binary
	const CodeObject::funclist &all = co->funcs();

	//iterate the ContainerWrapper
	auto fit = all.begin();
	for(int i=0; fit != all.end(); ++fit, i++){
		Function *f = *fit;
		cout << "{address: \"" << hex << f->addr() << "\", name: \"" << f->name() << "\"}," << endl;
	}
}
