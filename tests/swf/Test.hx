import format.swf.Data;
import format.abc.Data;
import format.swf.*;
class Test {
	static function main() {
		var bytes = haxe.Resource.getBytes("swf");
		var td = Generator.generate(new Reader(new haxe.io.BytesInput(bytes)).read());
		var pr = new haxe.macro.Printer();
		for(t in td)
			Sys.println(pr.printTypeDefinition(t));
	}
}
