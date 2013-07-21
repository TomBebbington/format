package format.tools;

@:native('Int')
abstract MemoryBytes(Int) from Int to Int {
	public static inline function make( pos : Int ) : MemoryBytes {
		return cast pos;
	}
	
	@:to inline function getPos() : Int {
		return cast this;
	}
	
	public inline function get( p : Int ) : Int {
		return flash.Memory.getByte(getPos() + p);
	}

	public inline function set( p : Int, v : Int ) : Void {
		flash.Memory.setByte(getPos() + p, v);
	}
	
}
