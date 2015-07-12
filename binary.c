#include<stdio.h>

void func1(int *x){
	*x = 0;
}

int main(void){
	int x = 1;
	func1(&x);
	return 0;
}
