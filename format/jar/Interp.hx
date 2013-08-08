package format.jar;

using format.jar.Tools;
using format.jclass.Tools;
import format.jclass.Data;
import format.jclass.*;
import format.jar.Data;
import haxe.io.*;
class Interp {
	var classes:Map<String, JClass>;
	var mainClass:String;
	public function new(d:Data) {
		var cls = d.readClasses();
		classes = [for(cl in cls) if(cl.thisId < cl.constants.length) cl.resolveConstant(cl.thisId) => cl];
		mainClass = d.getMainClass();
		if(cls.length == 1)
			mainClass = cls[0].resolveConstant(cls[0].thisId);
	}
	public function run() {
		var main = classes.get(mainClass);
		var mainMethod = null;
		for(mt in main.methods)
			if(main.resolveConstant(mt.nameIndex) == "main") {
				mainMethod = mt;
				break;
			}
		runMethod(main, mainMethod);
	}
	function runMethod(cl:JClass, m:Method):Void {
		for(a in m.attributes)
			switch(a) {
				case Code(c): vm(cl, c);
				default:
			}
	}
	public function vm(cl:JClass, c:Code):Void {
		var stack = new haxe.ds.GenericStack<Dynamic>();
		for(ind in 0...c.code.length) {
			var i = c.code[ind];
			switch(i) {
				case GetStatic(r):
					var data = cl.resolveConstant(r);
					stack.add(Reflect.field(Type.resolveClass(toHaxeType(data.owner)), data.name));
				case Ldc(r):
					stack.add(cl.resolveConstant(r));
				case InvokeVirtual(m):
					var s = cl.resolveConstant(m);
					var t = JavaType.parse(s.type);
					var args = null, ret = null;
					switch(t) {
						case Method(_args, _ret):
							args = _args;
							ret = _ret;
						default: throw 'Invalid method $t';
					}
					var margs = [for(_ in 0...args.length) stack.pop()];
					var obj = stack.pop();
					if(obj == null)
						throw 'Cannot access ${s.name} of null';
					Reflect.callMethod(obj, Reflect.field(obj, s.name), margs);
				case Return:
					return;
				default: throw 'Unimplemented: $i';
			}
		}
	}
	public static inline function toHaxeType(t:String):String {
		#if !java
			if(StringTools.startsWith(t, "java."))
				t = "jax."+t.substr(5);
		#end
		return StringTools.replace(t, "/", ".");
	}
}