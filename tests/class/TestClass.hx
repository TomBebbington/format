import format.jclass.*;
using format.jclass.Tools;
import haxe.io.*;
class TestClass {
	public static function main() {
		var classFile = haxe.Resource.getBytes("classfile");
		var d = new Reader(new BytesInput(classFile)).read();
		//trace(d);
		trace(d.toString());
		trace(new haxe.macro.Printer().printTypeDefinition(d.toHaxe()));
	}
}