package format.jar;
import format.jclass.Data;
import format.zip.Data;
import format.zip.Tools.uncompress;
import haxe.io.*;
using StringTools;
class Tools {
	static inline var MANIFEST = "meta-inf/manifest.mf";
	public static function getManifest(d:Data):Null<format.properties.Data> {
		for(e in d) {
			if(e.fileName.toLowerCase().trim() == MANIFEST) {
				if(e.compressed)
					uncompress(e);
				var d = new format.properties.Reader(new haxe.io.BytesInput(e.data)).read();
				return d;
			}
		}
		throw "No manifest found";
	}
	public static function findClass(d:Data, cl:String):Entry {
		cl = cl.replace(".", "/") + ".class";
		for(e in d)
			if(e.fileName == cl)
				return e;
		throw 'Could not find class: $cl';
	}
	public static function getMainClass(d:Data):String {
		return getManifest(d)["Main-Class"];
	}
	public static function readClasses(d:Data):Array<JClass> {
		return [for(e in d)
			if(e.fileName.endsWith(".class")) {
				var name = e.fileName;
				if(e.compressed)
					uncompress(e);
				try new format.jclass.Reader(new BytesInput(e.data)).read() catch(e:Dynamic) throw 'Could not read class $name due to $e';
			}];
	}
	public static function toString(d:Data):String {
		var m = Tools.getManifest(d);
		var s = new StringBuf();
		if(m != null)
			for(k in m.keys())
				s.add('$k: ${m.get(k)}\n');
		s.add("Classes:\n");
		var cs = Tools.readClasses(d);
		s.add("\t"+[for(c in cs) format.jclass.Tools.toString(c).replace("\n", "\n\t")].join("\n\t"));
		return s.toString();
	}
}