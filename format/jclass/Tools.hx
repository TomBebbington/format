package format.jclass;
import haxe.macro.Type;
import haxe.macro.Expr;
import format.jclass.Data;

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
	public static function toHaxeField(cl:JClass, f:Field):haxe.macro.Expr.Field {
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
			pos: null,
			name: resolveConstant(cl, f.nameIndex),
			kind: FieldType.FVar(resolveType(cl, f.descriptorIndex), fv),
			access: accesses
		};
	}
	static function toExprField(s:String):Expr {
		var fieldName = s.substr(s.lastIndexOf(".")+1);
		var rest = s.substr(0, s.lastIndexOf("."));
		var first:Expr = rest.indexOf(".") != -1 ? toExprField(rest) : {expr: EConst(CIdent(rest)), pos: null};
		return macro $first.$fieldName;
	}
	static function makeVar(b:Array<Expr>, s:Array<Expr>, e:Expr, ?t:ComplexType):Void {
		var n = 's${s.length}';
		if(t != null && haxe.macro.ComplexTypeTools.toString(t) == "Void")
			b.push(e);
		else {
			s.push({expr: EConst(CIdent(n)), pos: null});
			b.push(macro var $n:$t = $e);
		}
	}
	static function toExpr(cl:JClass, ins:Array<Instruction>, ?stack:Array<Expr>, isConst=false):Expr {
		if(stack == null) stack = [];
		var block:Array<Expr> = [];
		for(i in ins) {
			trace(i);
			switch(i) {
				case IALoad, LALoad, FALoad, DALoad, AALoad, BALoad, CALoad, SALoad: var ind = stack.pop(); var arr = stack.pop(); makeVar(block, stack, macro $arr[$ind]);
				case IConst(v): makeVar(block, stack, {expr: EConst(CInt(Std.string(v))), pos: null});
				case ALoad(i): makeVar(block, stack, {expr: EConst(CIdent("l"+i)), pos: null}); null;
				case IStore(i): var vname = 'v${i}'; macro $i{vname} = ${stack.pop()};
				case ILoad(i): stack.push(macro $i{'v${i}'});
				case BiPush(v): stack.push({expr: EConst(CInt(Std.string(v))), pos: null});
				case IfICmpGe(b): trace(b + ": "+ins.slice(b)+"/"+ins.length);
				case IInc(i, b): var name = 'v{i}', val:Expr = {expr: EConst(CInt(Std.string(i))), pos: null}; macro poo += $val;
				case InvokeSpecial(ind):
					var desc:String = resolveConstant(cl, ind);
					if(desc.indexOf("method ")==0)
						desc = desc.substr(7);
					var mtype:Array<String> = desc.split(":");
					var mname = mtype[1], type = resolveTypeString(mtype[2]), cls = mtype[0];
					if(mname == "<init>") {
						var clr:Array<String> = cls.split("/");
						var name:String = clr.pop();
						var typ:TypePath = {sub: null, params: [], pack: clr, name: name};
						makeVar(block, stack, {expr: ENew(typ, []), pos: null}, TPath(typ));
					} else {
						trace(stack.map(haxe.macro.ExprTools.toString));
						throw('Name: $mname, type: $type, class: $cls');
					}
				case GetStatic(r): switch(cl.constants[r]) {
					case FieldRef(c, nt):
						var c:String = resolveConstant(cl, c).split("/").join(".");
						var nt:String = resolveConstant(cl, nt);
						var type = resolveTypeString(nt.split(":").pop());
						var f = nt.split(":")[0];
						makeVar(block, stack, toExprField('$c.$f'), type);
					default:
				};
				case InvokeVirtual(m):
					var obj = stack[stack.length-2];
					var method:String = resolveConstant(cl, m);
					var mdesc:Array<String> = method.split(":");
					var mtype:ComplexType = resolveTypeString(mdesc.pop());
					var nargs = 0;
					var retType:ComplexType = switch(mtype) {
						case TFunction(args, ret):nargs = args.length; ret;
						default: null;
					};
					var mname = mdesc[1];
					var args:Array<Expr> = [for(i in 0...nargs) stack.pop()];
					stack.pop();
					makeVar(block, stack, {expr: ECall(macro $obj.$mname, args), pos: null}, retType);
				case Ldc(i): makeVar(block, stack, constantExpr(cl,i));
				case Return: macro return;
				case New(r):
					var clr:Array<String> = resolveConstant(cl, r).split("/");
					var name:String = clr.pop();
					var typ:TypePath = {sub: null, params: [], pack: clr, name: name};
					//makeVar(block, stack, {expr: ENew(typ, []), pos: null});
					makeVar(block, stack, macro null, TPath(typ));
				case Dup: var t = stack.pop(); makeVar(block, stack, t); makeVar(block, stack, t);
				default: throw 'Unrecognised instruction: $i';
			};
		}
		return {expr: ExprDef.EBlock(block), pos: null};
	}
	public static function toHaxeMethod(cl:JClass, m:Method):haxe.macro.Expr.Field {
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
		return {
			pos: null,
			name: {var c = resolveConstant(cl, m.nameIndex);c=="<init>"?"new":c;},
			kind: FieldType.FFun({
				ret: ret,
				params: [],
				expr: code == null ? null : toExpr(cl, code.code),
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
				"method " + resolveConstant(cl, cr) + ":" + resolveConstant(cl, ntr);
			case FieldRef(c, nt):
				"field " + resolveConstant(cl, c) + ":" + resolveConstant(cl, nt);
			case NameAndType(n, t):
				resolveConstant(cl, n) + ":" + resolveConstant(cl, t);
			default: trace(c); null;
		}
	}
	public static function constantExpr(cl:JClass, c:Int, ?p:haxe.macro.Expr.Position):Expr {
		return switch(cl.constants[c]) {
			case Str(s): {expr: EConst(CString(s)), pos: p};
			case StrRef(i): constantExpr(cl, i, p);
			case Int(i): {expr: EConst(CInt(Std.string(i))), pos: p};
			case Float(f) | Double(f): {expr: EConst(CFloat(Std.string(f))), pos: p};
			case Long(i): var a = {expr: EConst(CInt(Std.string(haxe.Int64.getHigh(i)))), pos: p}, b = {expr: EConst(CInt(Std.string(haxe.Int64.getLow(i)))), pos: p};macro haxe.Int64.make($a, $b);
			case all: throw 'Cannot resolve constant $all';
		}
	}
	public static function toString(c:JClass):String {
		var name = resolveConstant(c, c.thisId);
		var superName = resolveConstant(c, c.superId);
		trace(c.interfaces);
		return '$name extends $superName';//return ;
	}
}