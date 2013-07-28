import format.neko.*;
import sys.io.File;
class Test {
	static function main() {
		var d = new Reader(File.read("tests/neko/run.n", true)).read();
		trace(new VM().load(d));
	}
}