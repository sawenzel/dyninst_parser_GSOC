# ParseAPI
gsoc 2015

instalam libdyninst si libdyninst-dev 8.1:  
http://www.dyninst.org/downloads/dyninst-8.x  
descarcam boost:  
http://sourceforge.net/projects/boost/files/boost/1.57.0/  
copiem directorul boost in locatia unde s-a instalat libdyninst:  
cp -r boost_1_57_0/boost/ /usr/include/dyninst/  
facem build la libdwarf din surse si copiem libdwarf.so in usr/lib:  
http://askubuntu.com/questions/502749/install-libdwarf-so-on-ubuntu
