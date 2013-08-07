package format.jclass;
import haxe.macro.Type;
import haxe.macro.Expr;
import haxe.macro.*;
import format.jclass.Data;
import haxe.ds.GenericStack;
using StringTools;
using Lambda;
class Tools {
	public static function resolveField(cl:JClass, f:Field) {
		var name = resolveConstant(cl, f.nameIndex);
		var desc = resolveConstant(cl, f.descriptorIndex);
		return '$name - $desc';
	}
	public static function resolveVersion(v:Version):String {
		return switch(v.major) {
			case 51: "J2SE 7";
			case 50: "J2SE 6.0";
			case 49: "J2SE 6.0";
			case 48: "JDK 1.4";
			case 47: "JDK 1.3";
			case 46: "JDK 1.2";
			case 45: "JDK 1.1";
			case all if(all < 45): "Pre-JDK 1.1";
			default: "Post-J2SE 7";
		}
	}
	public static function resolveConstant(cl:JClass, c:Int):Dynamic {
		return switch(cl.constants[c]) {
			case Utf8(s): cast s;
			case Int(i): cast i;
			case Long(i): cast i;
			case Float(f): cast f;
			case Double(f): cast f;
			case StrRef(i): resolveConstant(cl, i);
			case ClassRef(i): resolveConstant(cl, i);
			case MethodRef(cr, ntr):
				var other = cast(resolveConstant(cl, ntr), String).split(":");
				cast {
					owner: resolveConstant(cl, cr),
					name: other[0],
					type: other[1]
				}
			case FieldRef(c, nt):
				var other = cast(resolveConstant(cl, nt), String).split(":");
				cast {
					owner: resolveConstant(cl, c),
					name: other[0],
					type: other[1]
				};
			case NameAndType(n, t):
				cast {
					name: resolveConstant(cl, n),
					type: resolveConstant(cl, t)
				}
			default: throw 'Constant $c not found';
		}
	}
	public static function fieldToString(c:JClass, f:Field) {
		var access = [for(a in f.accessFlags) a.getName().toLowerCase()+" "].join("");
		var name:String = resolveConstant(c, f.nameIndex);
		var descriptor:String = resolveConstant(c, f.descriptorIndex);
		return '$access$name $descriptor';
	}
	public static function methodToString(c:JClass, m:Method) {
		var access = [for(a in m.accessFlags) a.getName().toLowerCase()+" "].join("");
		var name:String = resolveConstant(c, m.nameIndex);
		var descriptor:String = resolveConstant(c, m.descriptorIndex);
		return '$access$name $descriptor';
	}
	public static function toString(c:JClass):String {
		var name = resolveConstant(c, c.thisId);
		var superName = resolveConstant(c, c.superId);
		var fieldDetails:String = [for(m in c.methods) "\n\t"+methodToString(c, m)].concat([for(f in c.fields) "\n\t"+fieldToString(c, f)]).join("");
		var interfaceDetails:String = c.interfaces.length > 0 ? " implements "+[for(i in c.interfaces) resolveConstant(c, i)].join(", ") : "";
		return '$name extends $superName${interfaceDetails}:$fieldDetails';//return ;
	}
}