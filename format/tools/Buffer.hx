package format.tools;
import haxe.io.*;
#if js
import js.html.*;
#end
abstract Buffer(Bytes) from Bytes to Bytes {
	public var length(get, never):Int;
	inline function get_length():Int return this.length;
	public inline function new(len:Int) this = Bytes.alloc(len);
	@:arrayAccess inline function set(i:Int, v:Int):Int {
		this.set(i, v);
		return v;
	}
	@:arrayAccess inline function get(i:Int):Int return this.get(i);
	public inline function toString() {
		if(length > 1000000000)
			length / 1000000000 + " GB";
		else if(length > 1000000)
			length / 1000000 + " MB";
		else if(length > 1000)
			length / 1000 + " KB";
		else
			'${length} B';
	}
	@:from public static inline function readFrom(i:Input):Buffer {
		return i.readAll();
	}
	@:to public inline function read():Input {
		return new haxe.io.BytesInput(this);
	}
	@:from public static inline function fromArray(a:Array<Int>):Buffer {
		var b = new Buffer(a.length);
		for(i in 0...a.length) b[i] = a[i];
		return b;
	}
	#if js
	@:from public static inline function fromArrayBuffer(a:ArrayBuffer):Buffer {
		var v = new js.html.Uint8Array(a);
		var b = new Buffer(v.length);
		for(i in 0...v.length)
			b[i] = v[i];
		return b;
	}
	@:to public inline function toArrayBuffer():ArrayBuffer {
		var v = new js.html.Uint8Array(this.length);
		for(i in 0...this.length)
			v[i] = this.get(i);
		return v.buffer;
	}
	#end
	public inline function iterator():Iterator<Int> {
		var i = 0;
		return {
			hasNext: function() return i < this.length,
			next: function() return this.get(i++)
		};
	}
}