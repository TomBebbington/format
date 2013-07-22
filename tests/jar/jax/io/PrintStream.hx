package jax.io;
import haxe.io.*;
abstract PrintStream(Output) from Output to Output {
	public inline function println(s:String)
		this.writeString('$s\n\r');
}