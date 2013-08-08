public class Test {
	public static void main(String[] args) {
		if(args.length > 0)
			System.out.println(args[0]);
		System.out.println(Test.greeting());
	}
	public static String greeting() {
		return "Hallo, world!";
	}
}