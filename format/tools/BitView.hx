package format.tools;
import haxe.io.Bytes;
abstract BitView(Bytes) from Bytes to Bytes {
	@:arrayAccess public inline function get(off:Int):Bool {
		return (this.get(Std.int(off / 8)) >>> (off % 8)) & 1 == 1;
	}
	@:arrayAccess public inline function set(off:Int, v:Bool):Bool {
		var boff = Std.int(off / 8);
		this.set(boff, this.get(boff) | (1 << (off % 8)));
		return v;
	}
	public inline function getByte(off:Int):Int {
		return this.get(Std.int(off / 8));
	}
}