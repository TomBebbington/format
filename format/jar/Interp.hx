package format.jar;

using format.jar.Tools;
using format.jclass.Tools;
import format.jclass.Data;
import format.jclass.*;
import format.jar.Data;
import format.jclass.JavaType;
import haxe.io.*;
class Interp {
	var classes:Map<String, JClass>;
	var mainClass:String = null;
	public function new(d:Array<JClass>) {
		classes = [for(cl in d) if(cl.thisId < cl.constants.length) cl.resolveConstant(cl.thisId) => cl];
		if(d.length == 1)
			mainClass = d[0].resolveConstant(d[0].thisId);
		else {
			for(c in classes) {
				for(m in c.methods) {
					if(c.resolveConstant(m.nameIndex) == "name") {
						mainClass = c.resolveConstant(c.thisId);
						break;
					}
				}
				if(mainClass != null)
					break;
			}
		}
	}
	public function run() {
		if(mainClass == null)
			throw "Could not find a main class";
		var main = classes.get(mainClass);
		var mainMethod = null;
		for(mt in main.methods)
			if(main.resolveConstant(mt.nameIndex) == "main") {
				mainMethod = mt;
				break;
			}
		runMethod(main, mainMethod, [#if sys Sys.args() #else [] #end], function(_){});
	}
	function runMethod(cl:JClass, m:Method, args:Array<Dynamic>, retf:Dynamic -> Void):Void {
		for(a in m.attributes)
			switch(a) {
				case Code(c): vm(cl, c, args, retf);
				default:
			}
	}
	public function vm(cl:JClass, c:Code, lvars:Array<Dynamic>, off:Int = 0, retf:Dynamic -> Void):Void {
		var stack = new haxe.ds.GenericStack<Dynamic>();
		if(lvars == null)
			lvars = [];
		for(ind in off...c.code.length) {
			var i = c.code[ind];
			#if debug trace('Op: $i, Lvars: $lvars, Stack: $stack'); #end
			switch(i) {
				case GetStatic(r):
					var data = cl.resolveConstant(r);
					var clsName = toHaxeType(data.owner);
					var cls = Type.resolveClass(clsName);
					if(cls == null)
						throw 'Class $clsName does not exist';
					stack.add(Reflect.field(cls, data.name));
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
					#if debug trace('Calling $obj.${s.name} with $margs'); #end
					var r = Reflect.callMethod(obj, Reflect.field(obj, s.name), margs);
					if(ret != null && ret != JavaTypeData.Void)
						stack.add(r);
				case InvokeStatic(m):
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
					if(classes.exists(s.owner)) {
						var owner = classes.get(s.owner);
						var m = owner.findMethod(s.name);
						runMethod(owner, m, margs, function(v) stack.add(v));
					} else
						try {
							var cls = Type.resolveClass(toHaxeType(s.owner));
							var r = Reflect.callMethod(cls, Reflect.field(cls, s.name), margs);
							if(ret != null && ret != JavaTypeData.Void)
								stack.add(r);
						} catch(v:Dynamic) {
							throw 'Could not call method ${s.owner}.${s.name}(${margs.join(", ")}) due to $v';
						}
				case IConst(v): stack.add(v);
				case IStore(i): lvars[i] = stack.pop();
				case ILoad(i) | ALoad(i): stack.add(lvars[i]);
				case ArrayLen: stack.add(stack.pop().length);
				case Return:
					retf(Void);
				case ReturnRef:
					retf(stack.pop());
				case IfICmpGe(b):
					var val2 = stack.pop();
					var val1 = stack.pop();
					if(val1 >= val2)
						vm(cl, c, lvars, b, retf);
				case FALoad:
					var ind:Int = stack.pop();
					var arr:Array<Dynamic> = stack.pop();
					stack.add(arr[ind]);
				case IInc(i, b):
					lvars[i] += b;
				case Goto(b):
					vm(cl, c, lvars, b, retf);
					break;
				case IfLe(b):
					if(stack.pop() <= 0) {
						vm(cl, c, lvars, b, retf);
						break;
					}
				default: throw 'Unimplemented: $i';
			}
		}
	}
	public static inline function toHaxeType(t:String):String {
		#if !java
			if(StringTools.startsWith(t, "java/"))
				t = "jax/"+t.substr(5);
		#end
		return StringTools.replace(t, "/", ".");
	}
}