package format.properties;
import haxe.io.*;
class Writer {
	var o:Output;
	public function new(o:Output) {
		this.o = o;
	}
	public function write(d:Data):Void {
		for(k in d.keys()) {
			o.writeString(k);
			o.writeString(": ");
			o.writeString(d[k]);
			o.writeString("\n");
		}
	}
}