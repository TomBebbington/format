import format.neko.*;
import sys.io.File;
class Test {
	static function main() {
		var d = new Reader(File.read("tests/neko/hello.n", true)).read();
		Sys.println(Tools.dump(d));
		new VM().load(d);
	}
}