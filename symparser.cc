#include "Symtab.h"
#include "Archive.h"
#include "CodeObject.h"
#include "CFG.h"
//#include "Function.h"

using namespace Dyninst;
using namespace SymtabAPI;
using namespace ParseAPI;

int main(int argc, char **argv){
	std::string file = "librt.a";
	char *filestr = new char[20];
	strcpy(filestr, file.c_str());

	Archive *ar = NULL;

	vector<Symtab *> symTabs;

	bool err = Archive::openArchive(ar, file);
	ar->getAllMembers(symTabs);

	auto fit = symTabs.begin();
	for(int i=0; fit != symTabs.end(); ++fit, i++){
		Symtab *s = *fit;
		SymtabCodeSource *sts = new SymtabCodeSource(s);

		CodeObject *co = new CodeObject(sts);
		co->parse();

		const CodeObject::funclist &all = co->funcs();
		auto fit = all.begin();
		for(;fit != all.end(); fit++){
			ParseAPI::Function *f = *fit;
			cout << f->name();
		}
	}

	cout << err;
}
