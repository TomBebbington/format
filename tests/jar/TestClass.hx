import format.jar.*;
import haxe.io.*;
import format.tools.*;
class TestClass {
	public static function main() {
		var args = new haxe.ds.Vector(1);
		args[0] = "Hello, world!";
		Test.main(cast args);
	}
}
@:build(format.jclass.Tools.build("tests/jar/Test.class")) class Test extends jax.lang.Object {

}