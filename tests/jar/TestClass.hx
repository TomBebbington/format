using sys.io.File;
import format.jclass.Reader;
import format.jar.Tools;
import format.jar.Interp;
import jax.lang.System;
class TestClass {
	public static function main() {
		var bi = "tests/jar/Test.class".read(true);
		var r = new Reader(bi);
		var data = r.read();
		var i = new Interp([data]);
		i.run();
	}
}