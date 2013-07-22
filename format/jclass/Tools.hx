package format.jclass;
import haxe.macro.Type;
import haxe.macro.Expr;
import haxe.macro.*;
import format.jclass.Data;
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
	static function toTypePath(cp:String):TypePath {
		var parts = cp.split("/");
		#if !java if(parts[0] == "java") parts[0] = "jax"; #end
		return {
			params: [],
			pack: parts.slice(0, parts.length-1),
			name: parts[parts.length-1]
		};
	}
	public static function resolveTypeString(c:String):ComplexType {
		c = StringTools.trim(c);
		while(c.charCodeAt(c.length-1) == ";".code) c = c.substr(0, c.length-1);
		return switch(c.charCodeAt(0)) {
			case "L".code: TPath(toTypePath(c.substr(1)));
			case "B".code, "C".code, "I".code, "S".code: TPath({name: "Int", pack: [], params: []});
			case "[".code: TPath({name:"Vector", pack: ["haxe", "ds"], params: [TPType(resolveTypeString(c.substr(1)))]});
			case "D".code, "F".code: TPath({name: "Float", pack: [], params: []});
			case "J".code: TPath({name: "Int64", pack: ["haxe"], params: []});
			case "Z".code: TPath({name: "Bool", pack: [], params: []});
			case "V".code: TPath({name: "Void", pack: [], params: []});
			case "(".code:
				var args = c.substring(1, c.lastIndexOf(")")).split(",");
				ComplexType.TFunction(args.filter(function(s) return s.length > 0).map(resolveTypeString), resolveTypeString(c.substr(c.lastIndexOf(")")+1)));
			case all: throw 'Unrecognised type: $c';
		};
	}
	public static function resolveType(cl:JClass, i:Int):ComplexType {
		return resolveTypeString(resolveConstant(cl, i));
	}
	public static function toHaxeField(cl:JClass, f:Field):Expr.Field {
		var fv:Expr = null;
		for(a in f.attributes)
			switch(a) {
				case ConstantValue(v): fv = constantExpr(cl, v);
				default:
			}
		var accesses:Array<Access> = [];
		for(f in f.accessFlags)
			switch(f) {
				case Public: accesses.push(Access.APublic);
				case Private: accesses.push(Access.APrivate);
				case Static: accesses.push(Access.AStatic);
				default:
			}
		return {
			pos: Tools.pos(),
			name: resolveConstant(cl, f.nameIndex),
			kind: FieldType.FVar(resolveType(cl, f.descriptorIndex), fv),
			access: accesses
		};
	}
	static function toExprField(s:String):Expr {
		var fieldName = s.substr(s.lastIndexOf(".")+1);
		var rest = s.substr(0, s.lastIndexOf("."));
		var first:Expr = rest.indexOf(".") != -1 ? toExprField(rest) : {expr:  EConst(CIdent(rest)), pos: Tools.pos()};
		return macro $first.$fieldName;
	}
	static function makeVar(b:Array<Expr>, s:Array<Expr>, e:Expr, ?t:ComplexType):Void {
		var n = 's${s.length}';
		if(t != null && ComplexTypeTools.toString(t) == "Void")
			b.push(e);
		else {
			s.push({expr:  EConst(CIdent(n)), pos: Tools.pos()});
			b.push(macro var $n:$t = $e);
		}
	}
	static function getId(e:Expr):String {
		return switch(e.expr) {
			case EConst(CIdent(s)): s;
			default: throw "Not an identifier";
		}
	}
	static function toExpr(cl:JClass, ins:Array<Instruction>, ?stack:Array<Expr>, isConst=false):Expr {
		if(stack == null) stack = [];
		var block:Array<Expr> = [];
		for(i in ins) {
			#if debug trace(i+", Stack: "+[for(s in stack) ExprTools.toString(s)].join(", ")); #end
			switch(i) {
				case IALoad | FALoad:
					var ind = stack.pop();
					var arr = stack.pop();
					makeVar(block, stack, macro $arr[$ind]);
				case AStore(i) | IStore(i): var name = 'l${i}'; block.push(macro var $name = ${stack.pop()});
				case ALoad(i) | ILoad(i): stack.push(macro $i{'l${i}'});
				case IConst(v): stack.push({expr:  EConst(CInt(Std.string(v))), pos: Tools.pos()});
				case BiPush(v): stack.push({expr:  EConst(CInt(Std.string(v))), pos: Tools.pos()});
				case Dup: stack.push(stack[stack.length-1]);
				case Ldc(r): stack.push(constantExpr(cl, r));
				case InvokeSpecial(i) if(resolveConstant(cl, i).name == "<init>" && block.length == 0):
					var objId = getId(stack.pop());
					var m:FieldInfo = resolveConstant(cl, i);
					var argsLen:Int = switch(Tools.resolveTypeString(m.type)) {
						case ComplexType.TFunction(args, _): args.length;
						default: 0;
					}
					var args:Array<Expr> = [for(i in 0...argsLen) stack.pop()];
					block.push({expr: ECall(macro super, args), pos: pos()});
				case InvokeSpecial(i) if(resolveConstant(cl, i).name == "<init>"):
					var objId = getId(stack.pop());
					var m:FieldInfo = resolveConstant(cl, i);
					var argsLen:Int = switch(Tools.resolveTypeString(m.type)) {
						case ComplexType.TFunction(args, _): args.length;
						default: 0;
					}
					var args:Array<Expr> = [for(i in 0...argsLen) stack.pop()];
					var newe:Expr = {expr: ENew(Tools.toTypePath(m.owner), args), pos: pos()};
					block.push(macro $i{objId} = $newe);
					stack.push(macro $i{objId});
				case InvokeSpecial(i) | InvokeVirtual(i): 
					var m:FieldInfo = resolveConstant(cl, i);
					var name = m.name;
					var t:ComplexType = Tools.resolveTypeString(m.type);
					var ret:ComplexType = null;
					var argsLen:Int = switch(t) {
						case ComplexType.TFunction(args, rett): ret = rett; args.length;
						default: 0;
					};
					var args:Array<Expr> = [for(i in 0...argsLen) stack.pop()];
					var obj = stack.pop();
					makeVar(block, stack, {expr: ECall(macro $obj.$name, args), pos: pos()}, ret);
				case PutField(f):
					var fi:FieldInfo = resolveConstant(cl, f);
					var ftype = Tools.resolveTypeString(fi.type);
					var field = fi.name;
					var tpath = Tools.toTypePath(fi.owner);
					var ownere:Expr = toExprField(ComplexTypeTools.toString(TPath(tpath)));
					var expr = macro $ownere.$field;
					makeVar(block, stack, expr, ftype);
				case ReturnRef: var re = stack.pop(); block.push(macro return $re);
				case Return: block.push(macro return);
				case New(r): 
					var po:String = resolveConstant(cl, r);
					var t:ComplexType = TPath(Tools.toTypePath(po));
					makeVar(block, stack, macro null, t);
				default: throw 'Unrecognised instruction: $i';
			};
		}
		return {expr:  ExprDef.EBlock(block), pos: Tools.pos()};
	}
	public static function toHaxeMethod(cl:JClass, m:Method):Expr.Field {
		var fv:Expr = null;
		for(a in m.attributes)
			switch(a) {
				case ConstantValue(v): fv = constantExpr(cl, v);
				default:
			}
		var type = resolveType(cl, m.descriptorIndex);
		var ret = null, args = null;
		switch(type) {
			case ComplexType.TFunction(aargs, aret):
				args = aargs; ret = aret;
			default:
		}
		var accesses:Array<Access> = [];
		for(f in m.accessFlags)
			switch(f) {
				case Public: accesses.push(Access.APublic);
				case Private: accesses.push(Access.APrivate);
				case Static: accesses.push(Access.AStatic);
				default:
			}
		var code:Code = null;
		for(a in m.attributes)
			switch(a) {
				case Code(c): code = c;
				default:
			}
		var c = resolveConstant(cl, m.nameIndex);
		var name = c == "<init>" ? "new": c;
		var thisIdent = "l" + args.length;
		return {
			pos: Tools.pos(),
			name: name,
			kind: FieldType.FFun({
				ret: ret,
				params: [],
				expr: code == null ? null : {
					var e:Expr = toExpr(cl, code.code);
					if(!accesses.has(Access.AStatic) && name != "new") {
						switch(e.expr) {
							case EBlock(es):
								es.insert(0, macro var $thisIdent = this);
							default:
						}
					}
					e;
				},
				args: [for(i in 0...args.length) {type: args[i], opt: false, name: 'l${i}'}]
			}),
			access: accesses
		};
	}
	public static function toHaxe(cl:JClass):TypeDefinition {
		var pos = #if macro Context.currentPos() #else null #end;
		var name:String = resolveConstant(cl, cl.thisId);
		var nameParts = name.split("/");
		var superClass = toTypePath(resolveConstant(cl, cl.superId));
		return {
			pos: pos,
			params: [],
			name: nameParts[nameParts.length-1],
			pack: nameParts.slice(0, nameParts.length-1),
			meta: [],
			isExtern: false,
			fields: [for(f in cl.fields) toHaxeField(cl, f)].concat([for(m in cl.methods) toHaxeMethod(cl, m)]),
			kind: TypeDefKind.TDClass(superClass)
		};
	}
	#if macro
	public static macro function build(path:String):Array<Expr.Field> {
		if(!sys.FileSystem.exists(path))
			throw '"$path" does not exist in "${Sys.getCwd()}"';
		var cls:ClassType = Context.getLocalClass().get();
		var inp = sys.io.File.read(path, true);
		var cl:JClass = new Reader(inp).read();
		var superPath = Tools.toTypePath(Tools.resolveConstant(cl, cl.superId));
		var superClass = switch(Context.getType(ComplexTypeTools.toString(TPath(superPath)))) {
			case TInst(t, ps):
				{t: t, params: ps};
			case all: throw 'Invalid superclass ${TypeTools.toString(all)}';
		};
		var fields = [for(f in cl.fields) toHaxeField(cl, f)].concat([for(m in cl.methods) toHaxeMethod(cl, m)]);
		#if debug for(f in fields) trace(new Printer().printField(f)); #end
		var localType = Context.getLocalType();
		switch(localType) {
			case TInst(ct, cps):
				var g:ClassType = ct.get();
				g.superClass = superClass;
			default:
		}
		return fields;
	}
	#end
	static inline function pos():Position {
		return #if macro Context.currentPos() #else null #end;
	}
	public static function resolveConstant(cl:JClass, c:Int):Dynamic {
		return switch(cl.constants[c]) {
			case Str(s): s;
			case StrRef(i): resolveConstant(cl, i);
			case Int(i): i;
			case Long(i): i;
			case Float(f): f;
			case Double(f): f;
			case ClassRef(i): resolveConstant(cl, i);
			case MethodRef(cr, ntr):
				var other = cast(resolveConstant(cl, ntr), String).split(":");
				{
					owner: resolveConstant(cl, cr),
					name: other[0],
					type: other[1]
				}
			case FieldRef(c, nt):
				var other = cast(resolveConstant(cl, nt), String).split(":");
				{
					owner: resolveConstant(cl, c),
					name: other[0],
					type: other[1]
				};
			case NameAndType(n, t):
				resolveConstant(cl, n) + ":" + resolveConstant(cl, t);
			default: throw 'Constant $c not found';
		}
	}
	public static function constantExpr(cl:JClass, c:Int):Expr {
		return switch(cl.constants[c]) {
			case Str(s): {expr: EConst(CString(s)), pos: pos()};
			case StrRef(i): constantExpr(cl, i);
			case Int(i): {expr: EConst(CInt(Std.string(i))), pos: pos()};
			case Float(f) | Double(f): {expr: EConst(CFloat(Std.string(f))), pos: pos()};
			case Long(i): var a = {expr: EConst(CInt(Std.string(haxe.Int64.getHigh(i)))), pos: pos()}, b = {expr: EConst(CInt(Std.string(haxe.Int64.getLow(i)))), pos: pos()};macro haxe.Int64.make($a, $b);
			case all: throw 'Cannot resolve constant $all';
		}
	}
	public static function toString(c:JClass):String {
		var name = resolveConstant(c, c.thisId);
		var superName = resolveConstant(c, c.superId);
		var fieldDetails:String = [for(m in c.methods) "\n\t"+[for(a in m.accessFlags) a.getName().toLowerCase()].join(" ")+" "+resolveConstant(c, m.nameIndex) + "\t:\t" + ComplexTypeTools.toString(Tools.resolveType(c, m.descriptorIndex))].join("");
		var interfaceDetails:String = c.interfaces.length > 0 ? " implements "+[for(i in c.interfaces) resolveConstant(c, i)].join(", ") : "";
		return '$name extends $superName${interfaceDetails}:$fieldDetails';//return ;
	}
}