using sys.io.File;
import format.jar.Reader;
import format.jar.Tools;
class TestClass {
	public static function main() {
		var bi = "tests/jar/test.jar".read(true);
		var r = new Reader(bi);
		var data = r.read();
		Sys.println(Tools.toString(data));
	}
}