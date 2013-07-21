package format.bc;
import format.tools.*;
import haxe.io.*;
typedef BittyInputData = {
	var oi:Input;
	var i:BitsInput;
	var o:Int;
}
abstract BittyInput(BittyInputData) from BittyInputData to BittyInputData {
	static inline var MAX_LEN = 16;
	public var offset(get, never):Int;
	inline function get_offset():Int return this.o;
	public inline function new(i:Input) {
		this = {
			oi:i,
			i: new BitsInput(i),
			o: 0
		};
	}
	public inline function align():Void {
		this.i.readBits(this.o % 32);
	}
	public inline function readBits(l:Int):Int {
		this.o += l;
		return this.i.readBits(l);
	}
	public inline function readBit():Bool {
		this.o++;
		return this.i.readBit();
	}
	public function readUInt32():Int {
		var ch1 = this.oi.readUInt16();
		var ch2 = this.oi.readUInt16();
		return this.oi.bigEndian ? ch2 | (ch1 << 16) : ch1 | (ch2 << 16);
	}
	public inline function readByte():Int {
		this.o += 8;
		return this.i.readBits(8);
	}
	public inline function readBytes(l:Int):Int {
		this.o += l * 8;
		return this.i.readBits(l * 8);
	}
	@:to public inline function toString():String {
		var b = new BytesBuffer();
		try while(true)
			b.addByte(readByte())
		catch(e:Dynamic) {}
		var by = b.getBytes();
		var bi1 = new haxe.io.BytesInput(by), bi2 = new haxe.io.BytesInput(by);
		this = new BittyInput(bi1);
		var n = new BittyInput(bi2);
		var s:String = "";
		try while(s.length < MAX_LEN)
			s += n.readBit() ? "1" : "0"
		catch(e:Dynamic) {}
		return s;
	}
	@:to inline function getInput():Input return this.oi;
}
class Reader {
	var bi:BittyInput;
	var abbrevWidth:Int = 2;
	public function new(i:Input) {
		i.bigEndian = true;
		bi = new BittyInput(i);
	}
	public function readVbr(len:Int=4):Int {
		var n:Int = 0, off:Int = 0;
		while(true) {
			var carry = bi.readBit();
			n += bi.readBits(len-1) << off;
			if(!carry)
				break;
			off += len-1;
		}
		return n;
	}
	public function readChar6():Int {
		var v = bi.readBits(6);
		return if(v < 26) "a".code + v
		else if(v < 52) "A".code + v - 26
		else if(v < 62) "0".code + v - 52
		else if(v == 62) ".".code
		else if(v == 63) "_".code
		else throw 'Invalid Char6 value: $v';
	}
	public function read():Data {
		if(bi.readBits(16) != 0x4243 && bi.readBits(16) != 0xC0DE)
			throw "Invalid bitcode signature";
		//trace(bi.toString());
		while(true) {
			var code = bi.readBits(abbrevWidth);
			trace(code);
			break;
		}
		return null;
	}
}