all: headers compile run
headers:
	javac hello.java
	javah -jni hello
compile:
	g++ -fPIC -I /usr/lib/jvm/java-7-openjdk-amd64/include/ -c hello.c
	g++ -shared hello.o -o libhello.so
run:
	java -Djava.library.path=. hello
