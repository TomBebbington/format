package format.nds;
import haxe.io.*;
import format.nds.Data;
class Reader {
	var i:Input;
	public function new(i:Input)
		this.i = i;

	public function read():Game {
		i.bigEndian = true;
		var name = i.readString(12);
		var gameCode = i.readString(4);
		var makerCode = i.readString(2);
		var unitCode = i.readByte();
		var encryptionSeed = i.readByte();
		var deviceCapicity = i.readByte();
		i.read(9);
		var romVersion = i.readByte();
		var flags = i.readByte();
		i.close();
		return {
			title: name,
			gameCode: gameCode,
			makerCode: makerCode,
			unitcode: unitCode,
			encryptionSeed: encryptionSeed,
			deviceCapacity: deviceCapicity,
			romVersion: romVersion,
			flags: flags
		};
	}
}