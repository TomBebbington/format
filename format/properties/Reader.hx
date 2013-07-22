package format.properties;
import haxe.io.*;
using StringTools;
class Reader {
	static var ASSIGN:EReg = ~/(?<!\\)[=:]/;
	var i:Input;
	public function new(i:Input) {
		this.i = i;
	}
	public function read():Data {
		var d:Data = new Data();
		try while(true) {
			var l = i.readLine().trim();
			if(l.startsWith("!") || l.startsWith("#")) // comment
				continue;
			var parts:Array<String> = ASSIGN.split(l);
			if(parts.length < 2)
				continue;
			var key:String = parts[0].trim();
			var value:String = parts[1].trim();
			d[key] = value;
		} catch(e:Eof) {}
		return d;
	}
}