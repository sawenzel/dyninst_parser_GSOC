#include <jni.h>
#include "hello.h"
JNIEXPORT void JNICALL Java_hello_sayHello
	(JNIEnv * env, jobject obj, jstring javaString)
  /*(JNIEnv * env, jobject obj, jint val)*/
{
	const char *nativeString = (env)->GetStringUTFChars(javaString, 0);
	printf("%s", nativeString);
	/*printf("%d", val);*/
}
