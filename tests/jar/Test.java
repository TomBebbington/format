public class Test {
	public static final String str = "Hello, world!";
	public String doThings() {
		return str + ", from Test!";
	}
	public static void main(String[] args) {
		System.out.println(args[0]);
		Test t = new Test();
		System.out.println(t.doThings());
	}
}