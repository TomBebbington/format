package format.swf;
import haxe.io.*;
import haxe.macro.*;
import haxe.macro.Expr;
import haxe.macro.Type;
import format.swf.Data;
import format.abc.Data;
class Generator {
	var d:SWF;
	public function new(d:SWF) {
		this.d = d;
	}
	public function getProject():Xml {
		var project = Xml.createElement("project");
		var ndll = Xml.createElement("ndll");
		ndll.set("name", "openfl");
		project.addChild(ndll);
		var lib = Xml.createElement("haxelib");
		lib.set("name", "openfl");
		project.addChild(lib);
		var window = Xml.createElement("window");
		project.addChild(window);
		window.set("width", Std.string(d.header.width));
		window.set("height", Std.string(d.header.height));
		window.set("fps", Std.string(d.header.fps));
		return project;
	}
	public function resolveMethodType(d:ABCData, n:Index<MethodType>):ComplexType {
		var t:MethodType = d.get(d.methodTypes, n);
		return ComplexType.TFunction([for(a in t.args) TPath(resolveName(d, a))], TPath(resolveName(d, t.ret)));
	}
	public function resolveName(d:ABCData, n:Index<Name>):TypePath {
		var n:Name = d.get(d.names, n);
		var s:String = switch(n) {
			case NName(name, ns):
				var namesp = d.get(d.namespaces, ns);
				var s = d.get(d.strings, name);
				switch(namesp) {
					case NPublic(i):
						var ns = d.get(d.strings, i);
						if(ns.length > 0)
							s = '$ns.$s';
					default:
				}
				s;
			default: throw "Bad name";
		};
		var ps = s.split(".");
		return {
			params: [],
			pack: ps.slice(0, ps.length-1),
			name: ps[ps.length-1]
		};
	}
	function resolveValue(a:ABCData, v:Value):Expr {
		return switch(v) {
			case VNull: macro null;
			case VBool(b) if(b): macro true;
			case VBool(b): macro false;
			case VString(i): {expr: EConst(CString(a.get(a.strings, i))), pos: pos()};
			case VInt(i) | VUInt(i): {expr: EConst(CInt(Std.string(a.get(a.ints, i)))), pos: pos()};
			case VFloat(i): {expr: EConst(CFloat(Std.string(a.get(a.floats, i)))), pos: pos()};
			case VNamespace(_, _): throw "Unsupported";
		};
	}
	function toExpr(b:Bytes) {

	}
	public function getClasses():Array<TypeDefinition> {
		var cs = new Array<TypeDefinition>();
		var inits:Array<Expr> = [];
		for(t in d.tags) {
			switch(t) {
				case TActionScript3(data, ctx):
					var opr = new format.abc.OpReader(new BytesInput(data));
					while(true) trace(opr.readOp(opr.readInt32()));
					/*
					for(c in asmr.classes) {
						var path:TypePath = resolveName(asmr, c.name);
						var superCl:TypePath = c.superclass == null ? null : resolveName(asmr, c.superclass), interfaces = [], isInterface = false;
						//trace('$path extends $superCl');
						var c:TypeDefinition = {
							name: path.name,
							pack: path.pack, 
							params: [],
							pos: pos(),
							meta: [],
							isExtern: false,
							kind: TypeDefKind.TDClass(superCl, interfaces, isInterface),
							fields: [for(f in c.fields) {
								var fname = resolveName(asmr, f.name).name;
								var faccess = [APublic];
								var fkind = switch(f.kind) {
									case FVar(type, value, const):
										var varType:ComplexType = TPath(resolveName(asmr, type));
										FieldType.FVar(varType, value == null ? null : resolveValue(asmr, value));
									case FMethod(type, k, isFinal, isOverride):
										var type = resolveMethodType(asmr, type);
										if(isOverride)
											faccess.push(AOverride);
										var fargs = null, fret = null;
										switch(type) {
											case TFunction(args, ret):
												fargs = args;
												fret = ret;
											default:
										}
										FieldType.FFun({
											args: [for(i in 0...fargs.length) {type: fargs[i], opt: false, name: (i < 26 ? String.fromCharCode("a".code+i) : 'a$i')}],
											ret: fret,
											params: [],
											expr: null
										});
									default:
										throw "Unsupported";
								};
								{pos: pos(), name: fname, kind: fkind, access: faccess};
							}]
						};
						cs.push(c);
					}*/
				case all: trace(all.getName());
			}
		}
		cs.push(macro class Flash {
			static function main() ${{expr: EBlock(inits), pos: pos()}};
		});
		return cs;
	}
	static inline function pos():Position
		return #if macro Context.currentPos() #else null #end;

	public static function generate(d:SWF):Array<TypeDefinition> {
		var g = new Generator(d);
		var pr = new haxe.macro.Printer();
		return g.getClasses();
	}
}