package format.pbc;
import haxe.io.*;
import format.pbc.Data;
class Reader {
	var i:Input;
	var wordSize:Int;
	public function new(i:Input)
		this.i = i;

	public function read():Data {
		if(i.readInt32() != 0x13155A1)
			throw "Invalid magic number";
		var d:Data = cast {};
		wordSize = i.readByte();
		i.bigEndian = switch(i.readByte()) {
			case 0: false;
			case 1: true;
			case all: throw 'Unknown byte order $all';
		}
		if(i.readByte() == 1)
			throw "Long double not supported";
		var version:Bytes = i.read(5);
		d.version = {
			minor: version.get(0),
			major: version.get(1),
			patch: version.get(2),
			bcMinor: version.get(3),
			bcMajor: version.get(4)
		};
		return d;
	}
}