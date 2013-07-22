package jax.lang;
import haxe.io.*;
class System {
	public static var out(get, never):Output;
	static inline function get_out():Output
		return Sys.stdout();
}