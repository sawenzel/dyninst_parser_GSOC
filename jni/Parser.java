public class Parser {
	private native String parse(String fileName);

	public static void main(String[] args) {
		String fileName = "binary";
		Parser h = new Parser();
		String response = h.parse(fileName);
		System.out.println("\nParser response:");
		System.out.println(response);
	}

	static {
		System.loadLibrary("dyninstParser");
	}
}
