#include<stdio.h>
#include<map>
#include<vector>
#include<unordered_map>
#include<sstream>
#include<memory>
#include "Symtab.h"

using namespace std;
using namespace Dyninst;
using namespace SymtabAPI;

int main(int argc, char *argv[]){
	Symtab *obj = NULL;
	std::string file = "PlacedTube.cpp.o";
	Symtab::openFile(obj, file);

	vector<Function *> funcs;
	obj->getAllFunctions(funcs);

	for(int i=0; i<funcs.size(); i++){
		Function *f = funcs[i];
		f->getAllMangledNames();
	}
}
