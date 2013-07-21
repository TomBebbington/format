public class Test {
	public static final String str = "Hello, world!";
	public static void main(String[] args) {
		System.out.println(args[1].charAt(0) + str);
		for(int i=0;i<100;i++) {
			System.out.println(str + " for the "+i+"th time!");
		}
	}
}