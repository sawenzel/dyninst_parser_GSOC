# ParseAPI
gsoc 2015

1.libdyninst:  
instalam libdyninst si libdyninst-dev 8.1:  
http://www.dyninst.org/downloads/dyninst-8.x  

2.boost:  
descarcam boost:  
http://sourceforge.net/projects/boost/files/boost/1.57.0/  
copiem directorul boost in locatia unde s-a instalat libdyninst:  
cp -r boost_1_57_0/boost/ /usr/include/dyninst/  

3.libelf, libdwarf:  
sudo apt-get install libelf-dev  
facem build la libdwarf din surse si copiem libdwarf.so in usr/lib:  
http://askubuntu.com/questions/502749/install-libdwarf-so-on-ubuntu
