# ParseAPI
gsoc 2015

1.libdyninst:  
Installing libdyninst and libdyninst-dev 8.1.2:  
http://www.dyninst.org/downloads/dyninst-8.x  

2.boost:  
Download boost:  
http://sourceforge.net/projects/boost/files/boost/1.57.0/  
Copy boost directory where libdyninst was installed:  
```cp -r boost_1_57_0/boost/ /usr/include/dyninst/  ```

3.libelf, libdwarf:  
```sudo apt-get install libelf-dev```   
Build libdwarf from sources and copy the dynamic library libdwarf.so (/dwarf-20130207/libdwarf/libdwarf.so) in /usr/lib:    
http://askubuntu.com/questions/502749/install-libdwarf-so-on-ubuntu
