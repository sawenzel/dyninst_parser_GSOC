public class hello {
	private native void sayHello(String str);

	public static void main(String[] args) {
		String str = "salut";
		hello h = new hello();
		h.sayHello(str);
		//h.sayHello(str.length());
	}

	static {
		System.loadLibrary("hello");
	}
}
