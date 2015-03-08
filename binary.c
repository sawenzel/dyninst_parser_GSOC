#include<stdio.h>

int funct(int x){
	if(x == 3)
		return 0;
	else return 1 + funct(x-1);
}

int main(int argc, char *argv[]){
	printf("%d", funct(5));
	return funct(3);
}
