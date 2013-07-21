(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
var TestClass = function() { }
$hxClasses["TestClass"] = TestClass;
TestClass.__name__ = true;
TestClass.main = function() {
	var classFile = haxe.Resource.getBytes("classfile");
	var d = new format.jclass.Reader(new haxe.io.BytesInput(classFile)).read();
	console.log(format.jclass.Tools.toString(d));
	console.log(new haxe.macro.Printer().printTypeDefinition(format.jclass.Tools.toHaxe(d)));
}
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
var format = {}
format.jclass = {}
format.jclass.Instruction = $hxClasses["format.jclass.Instruction"] = { __ename__ : true, __constructs__ : ["AConstNull","IConst","LConst","FConst","DConst","BiPush","SiPush","Ldc","Ldc2","ILoad","LLoad","FLoad","DLoad","ALoad","IALoad","LALoad","FALoad","DALoad","AALoad","BALoad","CALoad","SALoad","IStore","LStore","FStore","DStore","AStore","IAStore","GetStatic","InvokeVirtual","InvokeSpecial","Return"] }
format.jclass.Instruction.AConstNull = ["AConstNull",0];
format.jclass.Instruction.AConstNull.toString = $estr;
format.jclass.Instruction.AConstNull.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.IConst = function(v) { var $x = ["IConst",1,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.LConst = function(v) { var $x = ["LConst",2,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.FConst = function(v) { var $x = ["FConst",3,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.DConst = function(v) { var $x = ["DConst",4,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.BiPush = function(v) { var $x = ["BiPush",5,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.SiPush = function(v) { var $x = ["SiPush",6,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.Ldc = function(r) { var $x = ["Ldc",7,r]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.Ldc2 = function(r) { var $x = ["Ldc2",8,r]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.ILoad = function(i) { var $x = ["ILoad",9,i]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.LLoad = function(i) { var $x = ["LLoad",10,i]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.FLoad = function(i) { var $x = ["FLoad",11,i]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.DLoad = function(i) { var $x = ["DLoad",12,i]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.ALoad = function(i) { var $x = ["ALoad",13,i]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.IALoad = ["IALoad",14];
format.jclass.Instruction.IALoad.toString = $estr;
format.jclass.Instruction.IALoad.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.LALoad = ["LALoad",15];
format.jclass.Instruction.LALoad.toString = $estr;
format.jclass.Instruction.LALoad.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.FALoad = ["FALoad",16];
format.jclass.Instruction.FALoad.toString = $estr;
format.jclass.Instruction.FALoad.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.DALoad = ["DALoad",17];
format.jclass.Instruction.DALoad.toString = $estr;
format.jclass.Instruction.DALoad.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.AALoad = ["AALoad",18];
format.jclass.Instruction.AALoad.toString = $estr;
format.jclass.Instruction.AALoad.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.BALoad = ["BALoad",19];
format.jclass.Instruction.BALoad.toString = $estr;
format.jclass.Instruction.BALoad.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.CALoad = ["CALoad",20];
format.jclass.Instruction.CALoad.toString = $estr;
format.jclass.Instruction.CALoad.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.SALoad = ["SALoad",21];
format.jclass.Instruction.SALoad.toString = $estr;
format.jclass.Instruction.SALoad.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.IStore = function(v) { var $x = ["IStore",22,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.LStore = function(v) { var $x = ["LStore",23,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.FStore = function(v) { var $x = ["FStore",24,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.DStore = function(v) { var $x = ["DStore",25,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.AStore = function(v) { var $x = ["AStore",26,v]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.IAStore = ["IAStore",27];
format.jclass.Instruction.IAStore.toString = $estr;
format.jclass.Instruction.IAStore.__enum__ = format.jclass.Instruction;
format.jclass.Instruction.GetStatic = function(r) { var $x = ["GetStatic",28,r]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.InvokeVirtual = function(m) { var $x = ["InvokeVirtual",29,m]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.InvokeSpecial = function(ind) { var $x = ["InvokeSpecial",30,ind]; $x.__enum__ = format.jclass.Instruction; $x.toString = $estr; return $x; }
format.jclass.Instruction.Return = ["Return",31];
format.jclass.Instruction.Return.toString = $estr;
format.jclass.Instruction.Return.__enum__ = format.jclass.Instruction;
format.jclass.Attribute = $hxClasses["format.jclass.Attribute"] = { __ename__ : true, __constructs__ : ["Code","Exceptions","ConstantValue","Synthetic","InnerClasses","SourceFile","Unknown"] }
format.jclass.Attribute.Code = function(c) { var $x = ["Code",0,c]; $x.__enum__ = format.jclass.Attribute; $x.toString = $estr; return $x; }
format.jclass.Attribute.Exceptions = ["Exceptions",1];
format.jclass.Attribute.Exceptions.toString = $estr;
format.jclass.Attribute.Exceptions.__enum__ = format.jclass.Attribute;
format.jclass.Attribute.ConstantValue = function(v) { var $x = ["ConstantValue",2,v]; $x.__enum__ = format.jclass.Attribute; $x.toString = $estr; return $x; }
format.jclass.Attribute.Synthetic = ["Synthetic",3];
format.jclass.Attribute.Synthetic.toString = $estr;
format.jclass.Attribute.Synthetic.__enum__ = format.jclass.Attribute;
format.jclass.Attribute.InnerClasses = ["InnerClasses",4];
format.jclass.Attribute.InnerClasses.toString = $estr;
format.jclass.Attribute.InnerClasses.__enum__ = format.jclass.Attribute;
format.jclass.Attribute.SourceFile = function(s) { var $x = ["SourceFile",5,s]; $x.__enum__ = format.jclass.Attribute; $x.toString = $estr; return $x; }
format.jclass.Attribute.Unknown = function(name,bytes) { var $x = ["Unknown",6,name,bytes]; $x.__enum__ = format.jclass.Attribute; $x.toString = $estr; return $x; }
format.jclass.Constant = $hxClasses["format.jclass.Constant"] = { __ename__ : true, __constructs__ : ["Str","Int","Long","Float","Double","ClassRef","StrRef","FieldRef","MethodRef","InterfRef","NameAndType","MethodHandle","MethodType"] }
format.jclass.Constant.Str = function(s) { var $x = ["Str",0,s]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.Int = function(i) { var $x = ["Int",1,i]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.Long = function(i) { var $x = ["Long",2,i]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.Float = function(f) { var $x = ["Float",3,f]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.Double = function(f) { var $x = ["Double",4,f]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.ClassRef = function(i) { var $x = ["ClassRef",5,i]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.StrRef = function(i) { var $x = ["StrRef",6,i]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.FieldRef = function(c,nt) { var $x = ["FieldRef",7,c,nt]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.MethodRef = function(c,nt) { var $x = ["MethodRef",8,c,nt]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.InterfRef = function(c,nt) { var $x = ["InterfRef",9,c,nt]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.NameAndType = function(n,t) { var $x = ["NameAndType",10,n,t]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.MethodHandle = function(k,r) { var $x = ["MethodHandle",11,k,r]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.Constant.MethodType = function(r) { var $x = ["MethodType",12,r]; $x.__enum__ = format.jclass.Constant; $x.toString = $estr; return $x; }
format.jclass.ClassAccessFlag = $hxClasses["format.jclass.ClassAccessFlag"] = { __ename__ : true, __constructs__ : ["Public","Final","Super","Interface","Abstract","Synthetic","Annotation","Enum"] }
format.jclass.ClassAccessFlag.Public = ["Public",0];
format.jclass.ClassAccessFlag.Public.toString = $estr;
format.jclass.ClassAccessFlag.Public.__enum__ = format.jclass.ClassAccessFlag;
format.jclass.ClassAccessFlag.Final = ["Final",1];
format.jclass.ClassAccessFlag.Final.toString = $estr;
format.jclass.ClassAccessFlag.Final.__enum__ = format.jclass.ClassAccessFlag;
format.jclass.ClassAccessFlag.Super = ["Super",2];
format.jclass.ClassAccessFlag.Super.toString = $estr;
format.jclass.ClassAccessFlag.Super.__enum__ = format.jclass.ClassAccessFlag;
format.jclass.ClassAccessFlag.Interface = ["Interface",3];
format.jclass.ClassAccessFlag.Interface.toString = $estr;
format.jclass.ClassAccessFlag.Interface.__enum__ = format.jclass.ClassAccessFlag;
format.jclass.ClassAccessFlag.Abstract = ["Abstract",4];
format.jclass.ClassAccessFlag.Abstract.toString = $estr;
format.jclass.ClassAccessFlag.Abstract.__enum__ = format.jclass.ClassAccessFlag;
format.jclass.ClassAccessFlag.Synthetic = ["Synthetic",5];
format.jclass.ClassAccessFlag.Synthetic.toString = $estr;
format.jclass.ClassAccessFlag.Synthetic.__enum__ = format.jclass.ClassAccessFlag;
format.jclass.ClassAccessFlag.Annotation = ["Annotation",6];
format.jclass.ClassAccessFlag.Annotation.toString = $estr;
format.jclass.ClassAccessFlag.Annotation.__enum__ = format.jclass.ClassAccessFlag;
format.jclass.ClassAccessFlag.Enum = ["Enum",7];
format.jclass.ClassAccessFlag.Enum.toString = $estr;
format.jclass.ClassAccessFlag.Enum.__enum__ = format.jclass.ClassAccessFlag;
format.jclass.MethodAccessFlag = $hxClasses["format.jclass.MethodAccessFlag"] = { __ename__ : true, __constructs__ : ["Public","Private","Protected","Static","Final","Synchronized","Bridge","VarArgs","Native","Abstract","Strict","Synthetic"] }
format.jclass.MethodAccessFlag.Public = ["Public",0];
format.jclass.MethodAccessFlag.Public.toString = $estr;
format.jclass.MethodAccessFlag.Public.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Private = ["Private",1];
format.jclass.MethodAccessFlag.Private.toString = $estr;
format.jclass.MethodAccessFlag.Private.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Protected = ["Protected",2];
format.jclass.MethodAccessFlag.Protected.toString = $estr;
format.jclass.MethodAccessFlag.Protected.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Static = ["Static",3];
format.jclass.MethodAccessFlag.Static.toString = $estr;
format.jclass.MethodAccessFlag.Static.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Final = ["Final",4];
format.jclass.MethodAccessFlag.Final.toString = $estr;
format.jclass.MethodAccessFlag.Final.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Synchronized = ["Synchronized",5];
format.jclass.MethodAccessFlag.Synchronized.toString = $estr;
format.jclass.MethodAccessFlag.Synchronized.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Bridge = ["Bridge",6];
format.jclass.MethodAccessFlag.Bridge.toString = $estr;
format.jclass.MethodAccessFlag.Bridge.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.VarArgs = ["VarArgs",7];
format.jclass.MethodAccessFlag.VarArgs.toString = $estr;
format.jclass.MethodAccessFlag.VarArgs.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Native = ["Native",8];
format.jclass.MethodAccessFlag.Native.toString = $estr;
format.jclass.MethodAccessFlag.Native.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Abstract = ["Abstract",9];
format.jclass.MethodAccessFlag.Abstract.toString = $estr;
format.jclass.MethodAccessFlag.Abstract.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Strict = ["Strict",10];
format.jclass.MethodAccessFlag.Strict.toString = $estr;
format.jclass.MethodAccessFlag.Strict.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.MethodAccessFlag.Synthetic = ["Synthetic",11];
format.jclass.MethodAccessFlag.Synthetic.toString = $estr;
format.jclass.MethodAccessFlag.Synthetic.__enum__ = format.jclass.MethodAccessFlag;
format.jclass.FieldAccessFlag = $hxClasses["format.jclass.FieldAccessFlag"] = { __ename__ : true, __constructs__ : ["Public","Private","Protected","Static","Final","Volatile","Transient","Synthetic","Enum"] }
format.jclass.FieldAccessFlag.Public = ["Public",0];
format.jclass.FieldAccessFlag.Public.toString = $estr;
format.jclass.FieldAccessFlag.Public.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.FieldAccessFlag.Private = ["Private",1];
format.jclass.FieldAccessFlag.Private.toString = $estr;
format.jclass.FieldAccessFlag.Private.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.FieldAccessFlag.Protected = ["Protected",2];
format.jclass.FieldAccessFlag.Protected.toString = $estr;
format.jclass.FieldAccessFlag.Protected.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.FieldAccessFlag.Static = ["Static",3];
format.jclass.FieldAccessFlag.Static.toString = $estr;
format.jclass.FieldAccessFlag.Static.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.FieldAccessFlag.Final = ["Final",4];
format.jclass.FieldAccessFlag.Final.toString = $estr;
format.jclass.FieldAccessFlag.Final.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.FieldAccessFlag.Volatile = ["Volatile",5];
format.jclass.FieldAccessFlag.Volatile.toString = $estr;
format.jclass.FieldAccessFlag.Volatile.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.FieldAccessFlag.Transient = ["Transient",6];
format.jclass.FieldAccessFlag.Transient.toString = $estr;
format.jclass.FieldAccessFlag.Transient.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.FieldAccessFlag.Synthetic = ["Synthetic",7];
format.jclass.FieldAccessFlag.Synthetic.toString = $estr;
format.jclass.FieldAccessFlag.Synthetic.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.FieldAccessFlag.Enum = ["Enum",8];
format.jclass.FieldAccessFlag.Enum.toString = $estr;
format.jclass.FieldAccessFlag.Enum.__enum__ = format.jclass.FieldAccessFlag;
format.jclass.Reader = function(i) {
	this.i = i;
};
$hxClasses["format.jclass.Reader"] = format.jclass.Reader;
format.jclass.Reader.__name__ = true;
format.jclass.Reader.prototype = {
	read: function() {
		var d = { };
		this.i.set_bigEndian(true);
		if(this.i.readInt32() != -889275714) throw "Invalid magic number";
		var minorv = this.i.readUInt16();
		d.version = { minor : minorv, major : this.i.readUInt16()};
		console.log("Version: " + format.jclass.Tools.resolveVersion(d.version));
		var constCount = this.i.readUInt16() - 1;
		var _g = [];
		var _g1 = 0;
		while(_g1 < constCount) {
			var i = _g1++;
			_g.push(this.readConstant());
		}
		d.constants = _g;
		d.constants.splice(0,0,null);
		var consts = d.constants;
		var accessFlagsi = this.i.readUInt16();
		d.accessFlags = [];
		if((accessFlagsi & 1) != 0) d.accessFlags.push(format.jclass.ClassAccessFlag.Public);
		if((accessFlagsi & 16) != 0) d.accessFlags.push(format.jclass.ClassAccessFlag.Final);
		if((accessFlagsi & 32) != 0) d.accessFlags.push(format.jclass.ClassAccessFlag.Super);
		if((accessFlagsi & 512) != 0) d.accessFlags.push(format.jclass.ClassAccessFlag.Interface);
		if((accessFlagsi & 1024) != 0) d.accessFlags.push(format.jclass.ClassAccessFlag.Abstract);
		if((accessFlagsi & 4096) != 0) d.accessFlags.push(format.jclass.ClassAccessFlag.Synthetic);
		if((accessFlagsi & 8192) != 0) d.accessFlags.push(format.jclass.ClassAccessFlag.Annotation);
		if((accessFlagsi & 16384) != 0) d.accessFlags.push(format.jclass.ClassAccessFlag.Enum);
		console.log("Class access: " + Std.string(d.accessFlags));
		d.thisId = this.i.readUInt16();
		d.superId = this.i.readUInt16();
		console.log(Std.string(format.jclass.Tools.resolveConstant(d,d.thisId)) + " extends " + Std.string(format.jclass.Tools.resolveConstant(d,d.superId)));
		var _g1 = [];
		var _g3 = 0;
		var _g2 = this.i.readUInt16();
		while(_g3 < _g2) {
			var _ = _g3++;
			_g1.push(this.i.readUInt16());
		}
		d.interfaces = _g1;
		var _g2 = [];
		var _g4 = 0;
		var _g3 = this.i.readUInt16();
		while(_g4 < _g3) {
			var _ = _g4++;
			_g2.push((function($this) {
				var $r;
				var f = { };
				var flags = $this.i.readUInt16();
				f.accessFlags = [];
				if((flags & 1) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Public);
				if((flags & 2) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Private);
				if((flags & 4) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Protected);
				if((flags & 8) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Static);
				if((flags & 16) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Final);
				if((flags & 64) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Volatile);
				if((flags & 128) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Transient);
				if((flags & 4096) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Synthetic);
				if((flags & 16384) != 0) f.accessFlags.push(format.jclass.FieldAccessFlag.Enum);
				f.nameIndex = $this.i.readUInt16();
				f.descriptorIndex = $this.i.readUInt16();
				{
					var _g5 = [];
					var _g7 = 0;
					var _g6 = $this.i.readUInt16();
					while(_g7 < _g6) {
						var _1 = _g7++;
						_g5.push($this.readAttribute(d.constants));
					}
					f.attributes = _g5;
				}
				console.log(Std.string(format.jclass.Tools.resolveConstant(d,f.nameIndex)) + " : " + Std.string(format.jclass.Tools.resolveConstant(d,f.descriptorIndex)));
				$r = f;
				return $r;
			}(this)));
		}
		d.fields = _g2;
		var fields = d.fields;
		var _g3 = [];
		var _g5 = 0;
		var _g4 = this.i.readUInt16();
		while(_g5 < _g4) {
			var _ = _g5++;
			_g3.push((function($this) {
				var $r;
				var m = { };
				var flags = $this.i.readUInt16();
				m.accessFlags = [];
				if((flags & 1) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Public);
				if((flags & 2) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Private);
				if((flags & 4) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Protected);
				if((flags & 8) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Static);
				if((flags & 16) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Final);
				if((flags & 32) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Synchronized);
				if((flags & 64) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Bridge);
				if((flags & 128) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.VarArgs);
				if((flags & 256) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Native);
				if((flags & 1024) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Abstract);
				if((flags & 2048) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Strict);
				if((flags & 4096) != 0) m.accessFlags.push(format.jclass.MethodAccessFlag.Synthetic);
				m.nameIndex = $this.i.readUInt16();
				m.descriptorIndex = $this.i.readUInt16();
				{
					var _g6 = [];
					var _g8 = 0;
					var _g7 = $this.i.readUInt16();
					while(_g8 < _g7) {
						var _1 = _g8++;
						_g6.push($this.readAttribute(d.constants));
					}
					m.attributes = _g6;
				}
				$r = m;
				return $r;
			}(this)));
		}
		d.methods = _g3;
		return d;
	}
	,readInstructions: function(b) {
		var i = new haxe.io.BytesInput(b);
		var a = [];
		try {
			while(true) a.push((function($this) {
				var $r;
				var _g = i.readByte();
				$r = (function($this) {
					var $r;
					var all = _g;
					$r = (function($this) {
						var $r;
						switch(_g) {
						case 1:
							$r = format.jclass.Instruction.AConstNull;
							break;
						case 2:
							$r = format.jclass.Instruction.IConst(-1);
							break;
						case 3:
							$r = format.jclass.Instruction.IConst(0);
							break;
						case 4:
							$r = format.jclass.Instruction.IConst(1);
							break;
						case 5:
							$r = format.jclass.Instruction.IConst(2);
							break;
						case 6:
							$r = format.jclass.Instruction.IConst(3);
							break;
						case 7:
							$r = format.jclass.Instruction.IConst(4);
							break;
						case 8:
							$r = format.jclass.Instruction.IConst(5);
							break;
						case 9:
							$r = format.jclass.Instruction.LConst(new haxe.Int64(0,0));
							break;
						case 10:
							$r = format.jclass.Instruction.LConst(new haxe.Int64(0,1));
							break;
						case 11:
							$r = format.jclass.Instruction.FConst(0.0);
							break;
						case 12:
							$r = format.jclass.Instruction.FConst(1.0);
							break;
						case 13:
							$r = format.jclass.Instruction.FConst(2.0);
							break;
						case 14:
							$r = format.jclass.Instruction.DConst(0.0);
							break;
						case 15:
							$r = format.jclass.Instruction.DConst(1.0);
							break;
						case 16:
							$r = format.jclass.Instruction.BiPush(i.readInt8());
							break;
						case 17:
							$r = format.jclass.Instruction.SiPush(i.readInt16());
							break;
						case 18:
							$r = format.jclass.Instruction.Ldc(i.readByte());
							break;
						case 19:
							$r = format.jclass.Instruction.Ldc(i.readUInt16());
							break;
						case 20:
							$r = format.jclass.Instruction.Ldc2(i.readUInt16());
							break;
						case 21:
							$r = format.jclass.Instruction.ILoad(i.readByte());
							break;
						case 22:
							$r = format.jclass.Instruction.LLoad(i.readByte());
							break;
						case 23:
							$r = format.jclass.Instruction.FLoad(i.readByte());
							break;
						case 24:
							$r = format.jclass.Instruction.DLoad(i.readByte());
							break;
						case 25:
							$r = format.jclass.Instruction.ALoad(i.readByte());
							break;
						case 26:
							$r = format.jclass.Instruction.ILoad(0);
							break;
						case 27:
							$r = format.jclass.Instruction.ILoad(1);
							break;
						case 28:
							$r = format.jclass.Instruction.ILoad(2);
							break;
						case 30:
							$r = format.jclass.Instruction.ILoad(3);
							break;
						case 29:
							$r = format.jclass.Instruction.LLoad(0);
							break;
						case 31:
							$r = format.jclass.Instruction.LLoad(1);
							break;
						case 32:
							$r = format.jclass.Instruction.LLoad(2);
							break;
						case 33:
							$r = format.jclass.Instruction.LLoad(3);
							break;
						case 34:
							$r = format.jclass.Instruction.FLoad(0);
							break;
						case 35:
							$r = format.jclass.Instruction.FLoad(1);
							break;
						case 36:
							$r = format.jclass.Instruction.FLoad(2);
							break;
						case 37:
							$r = format.jclass.Instruction.FLoad(3);
							break;
						case 38:
							$r = format.jclass.Instruction.DLoad(0);
							break;
						case 39:
							$r = format.jclass.Instruction.DLoad(1);
							break;
						case 40:
							$r = format.jclass.Instruction.DLoad(2);
							break;
						case 41:
							$r = format.jclass.Instruction.DLoad(3);
							break;
						case 42:
							$r = format.jclass.Instruction.ALoad(0);
							break;
						case 43:
							$r = format.jclass.Instruction.ALoad(1);
							break;
						case 44:
							$r = format.jclass.Instruction.ALoad(2);
							break;
						case 45:
							$r = format.jclass.Instruction.ALoad(3);
							break;
						case 46:
							$r = format.jclass.Instruction.IALoad;
							break;
						case 47:
							$r = format.jclass.Instruction.LALoad;
							break;
						case 48:
							$r = format.jclass.Instruction.FALoad;
							break;
						case 49:
							$r = format.jclass.Instruction.DALoad;
							break;
						case 50:
							$r = format.jclass.Instruction.FALoad;
							break;
						case 51:
							$r = format.jclass.Instruction.BALoad;
							break;
						case 52:
							$r = format.jclass.Instruction.CALoad;
							break;
						case 53:
							$r = format.jclass.Instruction.SALoad;
							break;
						case 54:
							$r = format.jclass.Instruction.IStore(i.readByte());
							break;
						case 55:
							$r = format.jclass.Instruction.LStore(i.readByte());
							break;
						case 56:
							$r = format.jclass.Instruction.FStore(i.readByte());
							break;
						case 57:
							$r = format.jclass.Instruction.DStore(i.readByte());
							break;
						case 58:
							$r = format.jclass.Instruction.AStore(i.readByte());
							break;
						case 59:
							$r = format.jclass.Instruction.IStore(0);
							break;
						case 60:
							$r = format.jclass.Instruction.IStore(1);
							break;
						case 61:
							$r = format.jclass.Instruction.IStore(2);
							break;
						case 62:
							$r = format.jclass.Instruction.IStore(3);
							break;
						case 63:
							$r = format.jclass.Instruction.LStore(0);
							break;
						case 64:
							$r = format.jclass.Instruction.LStore(1);
							break;
						case 65:
							$r = format.jclass.Instruction.LStore(2);
							break;
						case 66:
							$r = format.jclass.Instruction.LStore(3);
							break;
						case 67:
							$r = format.jclass.Instruction.FStore(0);
							break;
						case 68:
							$r = format.jclass.Instruction.FStore(1);
							break;
						case 69:
							$r = format.jclass.Instruction.FStore(2);
							break;
						case 70:
							$r = format.jclass.Instruction.FStore(3);
							break;
						case 71:
							$r = format.jclass.Instruction.DStore(0);
							break;
						case 72:
							$r = format.jclass.Instruction.DStore(1);
							break;
						case 73:
							$r = format.jclass.Instruction.DStore(2);
							break;
						case 74:
							$r = format.jclass.Instruction.DStore(3);
							break;
						case 75:
							$r = format.jclass.Instruction.AStore(0);
							break;
						case 76:
							$r = format.jclass.Instruction.AStore(1);
							break;
						case 77:
							$r = format.jclass.Instruction.AStore(2);
							break;
						case 78:
							$r = format.jclass.Instruction.AStore(3);
							break;
						case 79:
							$r = format.jclass.Instruction.IAStore;
							break;
						case 177:
							$r = format.jclass.Instruction.Return;
							break;
						case 178:
							$r = format.jclass.Instruction.GetStatic(i.readUInt16());
							break;
						case 182:
							$r = format.jclass.Instruction.InvokeVirtual(i.readUInt16());
							break;
						case 183:
							$r = format.jclass.Instruction.InvokeSpecial(i.readUInt16());
							break;
						default:
							$r = (function($this) {
								var $r;
								throw "Unknown Instruction: " + StringTools.hex(all,2);
								return $r;
							}($this));
						}
						return $r;
					}($this));
					return $r;
				}($this));
				return $r;
			}(this)));
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return a;
	}
	,readAttribute: function(pool) {
		var name = pool[this.i.readUInt16()];
		if(name == null) throw "Could not find attribute name";
		var length = this.i.readInt32();
		switch(name[1]) {
		case 0:
			var s = name[2];
			switch(s) {
			case "Code":
				var code = { };
				var maxStack = this.i.readUInt16();
				var maxLocals = this.i.readUInt16();
				var codel = this.i.readInt32();
				var codei = new haxe.io.BytesBuffer();
				while(codel-- > 0) codei.b.push(this.i.readByte());
				code.code = this.readInstructions(codei.getBytes());
				var _g = [];
				var _g2 = 0;
				var _g1 = this.i.readUInt16();
				while(_g2 < _g1) {
					var _ = _g2++;
					_g.push((function($this) {
						var $r;
						var startPc = $this.i.readUInt16();
						var endPc = $this.i.readUInt16();
						var handlerPc = $this.i.readUInt16();
						var catchType = $this.i.readUInt16();
						$r = { startPc : startPc, endPc : endPc, handlerPc : handlerPc, catchType : catchType};
						return $r;
					}(this)));
				}
				code.trys = _g;
				var _g1 = [];
				var _g3 = 0;
				var _g2 = this.i.readUInt16();
				while(_g3 < _g2) {
					var i = _g3++;
					_g1.push(this.readAttribute(pool));
				}
				code.attributes = _g1;
				return format.jclass.Attribute.Code(code);
			case "Synthetic":
				return format.jclass.Attribute.Synthetic;
			case "ConstantValue":
				return format.jclass.Attribute.ConstantValue(this.i.readUInt16());
			case "SourceFile":
				return format.jclass.Attribute.SourceFile(this.i.readString(length));
			default:
				return format.jclass.Attribute.Unknown(s,this.i.read(length));
			}
			break;
		default:
			throw "No name given for attribute";
		}
	}
	,readConstant: function() {
		var bi = this.i.readByte();
		switch(bi) {
		case 1:case 2:
			return format.jclass.Constant.Str(this.i.readString(this.i.readUInt16()));
		case 3:
			return format.jclass.Constant.Int(this.i.readInt32());
		case 4:
			return format.jclass.Constant.Float(this.i.readFloat());
		case 5:
			var high = this.i.readInt32();
			var low = this.i.readInt32();
			return format.jclass.Constant.Long(new haxe.Int64(high,low));
		case 6:
			return format.jclass.Constant.Double(this.i.readDouble());
		case 7:
			return format.jclass.Constant.ClassRef(this.i.readUInt16());
		case 8:
			return format.jclass.Constant.StrRef(this.i.readUInt16());
		case 9:
			var nt = this.i.readUInt16();
			return format.jclass.Constant.FieldRef(nt,this.i.readUInt16());
		case 10:
			var nt = this.i.readUInt16();
			return format.jclass.Constant.MethodRef(nt,this.i.readUInt16());
		case 11:
			var nt = this.i.readUInt16();
			return format.jclass.Constant.InterfRef(nt,this.i.readUInt16());
		case 12:
			var n = this.i.readUInt16();
			return format.jclass.Constant.NameAndType(n,this.i.readUInt16());
		case 15:
			var kind = this.i.readByte();
			return format.jclass.Constant.MethodHandle(kind,this.i.readUInt16());
		case 16:
			return format.jclass.Constant.MethodType(this.i.readUInt16());
		case 18:
			break;
		default:
			throw "Unknown tag byte " + StringTools.hex(bi);
		}
	}
	,__class__: format.jclass.Reader
}
format.jclass.Tools = function() { }
$hxClasses["format.jclass.Tools"] = format.jclass.Tools;
format.jclass.Tools.__name__ = true;
format.jclass.Tools.resolveVersion = function(v) {
	var all = v.major;
	switch(v.major) {
	case 51:
		return "J2SE 7";
	case 50:
		return "J2SE 6.0";
	case 49:
		return "J2SE 6.0";
	case 48:
		return "JDK 1.4";
	case 47:
		return "JDK 1.3";
	case 46:
		return "JDK 1.2";
	case 45:
		return "JDK 1.1";
	default:
		if(all < 45) return "Pre-JDK 1.1"; else return "Post-J2SE 7";
	}
}
format.jclass.Tools.toTypePath = function(cp) {
	var parts = cp.split("/");
	return { params : [], pack : parts.slice(0,parts.length - 1), name : parts[parts.length - 1]};
}
format.jclass.Tools.resolveTypeString = function(c) {
	while(HxOverrides.cca(c,c.length - 1) == 59) c = HxOverrides.substr(c,0,c.length - 1);
	var _g = HxOverrides.cca(c,0);
	var all = _g;
	switch(_g) {
	case 76:
		return haxe.macro.ComplexType.TPath(format.jclass.Tools.toTypePath(HxOverrides.substr(c,1,null)));
	case 66:case 67:case 73:case 83:
		return haxe.macro.ComplexType.TPath({ name : "Int", pack : [], params : []});
	case 91:
		return haxe.macro.ComplexType.TPath({ name : "Vector", pack : ["haxe","ds"], params : [haxe.macro.TypeParam.TPType(format.jclass.Tools.resolveTypeString(HxOverrides.substr(c,1,null)))]});
	case 68:case 70:
		return haxe.macro.ComplexType.TPath({ name : "Float", pack : [], params : []});
	case 74:
		return haxe.macro.ComplexType.TPath({ name : "Int64", pack : ["haxe"], params : []});
	case 90:
		return haxe.macro.ComplexType.TPath({ name : "Bool", pack : [], params : []});
	default:
		throw "Unrecognised type: " + c;
	}
}
format.jclass.Tools.resolveType = function(cl,i) {
	return format.jclass.Tools.resolveTypeString(format.jclass.Tools.resolveConstant(cl,i));
}
format.jclass.Tools.toHaxeField = function(cl,f) {
	var fv = null;
	var _g = 0;
	var _g1 = f.attributes;
	while(_g < _g1.length) {
		var a = _g1[_g];
		++_g;
		switch(a[1]) {
		case 2:
			var v = a[2];
			fv = format.jclass.Tools.constantExpr(cl,v);
			break;
		default:
		}
	}
	var accesses = [];
	var _g = 0;
	var _g1 = f.accessFlags;
	while(_g < _g1.length) {
		var f1 = _g1[_g];
		++_g;
		switch(f1[1]) {
		case 0:
			accesses.push(haxe.macro.Access.APublic);
			break;
		case 1:
			accesses.push(haxe.macro.Access.APrivate);
			break;
		case 3:
			accesses.push(haxe.macro.Access.AStatic);
			break;
		default:
		}
	}
	return { pos : null, name : format.jclass.Tools.resolveConstant(cl,f.nameIndex), kind : haxe.macro.FieldType.FVar(format.jclass.Tools.resolveType(cl,f.descriptorIndex),fv), access : accesses};
}
format.jclass.Tools.toHaxeMethod = function(cl,m) {
	var fv = null;
	var _g = 0;
	var _g1 = m.attributes;
	while(_g < _g1.length) {
		var a = _g1[_g];
		++_g;
		switch(a[1]) {
		case 2:
			var v = a[2];
			fv = format.jclass.Tools.constantExpr(cl,v);
			break;
		default:
		}
	}
	var accesses = [];
	var _g = 0;
	var _g1 = m.accessFlags;
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		switch(f[1]) {
		case 0:
			accesses.push(haxe.macro.Access.APublic);
			break;
		case 1:
			accesses.push(haxe.macro.Access.APrivate);
			break;
		case 3:
			accesses.push(haxe.macro.Access.AStatic);
			break;
		default:
		}
	}
	return { pos : null, name : (function($this) {
		var $r;
		var c = format.jclass.Tools.resolveConstant(cl,m.nameIndex);
		$r = c == "<init>"?"new":c;
		return $r;
	}(this)), kind : haxe.macro.FieldType.FFun({ ret : null, params : [], expr : null, args : []}), access : accesses};
}
format.jclass.Tools.toHaxe = function(cl) {
	var pos = null;
	var name = format.jclass.Tools.resolveConstant(cl,cl.thisId);
	var nameParts = name.split("/");
	var superClass = format.jclass.Tools.toTypePath(format.jclass.Tools.resolveConstant(cl,cl.superId));
	return { pos : pos, params : [], name : nameParts[nameParts.length - 1], pack : nameParts.slice(0,nameParts.length - 1), meta : [], isExtern : false, fields : ((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			var _g2 = cl.fields;
			while(_g1 < _g2.length) {
				var f = _g2[_g1];
				++_g1;
				_g.push(format.jclass.Tools.toHaxeField(cl,f));
			}
		}
		$r = _g;
		return $r;
	}(this))).concat((function($this) {
		var $r;
		var _g1 = [];
		{
			var _g2 = 0;
			var _g3 = cl.methods;
			while(_g2 < _g3.length) {
				var m = _g3[_g2];
				++_g2;
				_g1.push(format.jclass.Tools.toHaxeMethod(cl,m));
			}
		}
		$r = _g1;
		return $r;
	}(this))), kind : haxe.macro.TypeDefKind.TDClass(superClass)};
}
format.jclass.Tools.resolveConstant = function(cl,c) {
	var _g = cl.constants[c];
	switch(_g[1]) {
	case 0:
		var s = _g[2];
		return s;
	case 6:
		var i = _g[2];
		return format.jclass.Tools.resolveConstant(cl,i);
	case 1:
		var i = _g[2];
		return i;
	case 2:
		var i = _g[2];
		return i;
	case 3:
		var f = _g[2];
		return f;
	case 4:
		var f = _g[2];
		return f;
	case 5:
		var i = _g[2];
		return format.jclass.Tools.resolveConstant(cl,i);
	case 8:
		var ntr = _g[3];
		var cr = _g[2];
		return "method " + Std.string(format.jclass.Tools.resolveConstant(cl,cr)) + ":" + Std.string(format.jclass.Tools.resolveConstant(cl,ntr));
	case 7:
		var nt = _g[3];
		var c1 = _g[2];
		return "field " + Std.string(format.jclass.Tools.resolveConstant(cl,c1)) + ":" + Std.string(format.jclass.Tools.resolveConstant(cl,nt));
	case 10:
		var t = _g[3];
		var n = _g[2];
		return Std.string(format.jclass.Tools.resolveConstant(cl,n)) + ":" + Std.string(format.jclass.Tools.resolveConstant(cl,t));
	default:
		console.log(c);
		return null;
	}
}
format.jclass.Tools.constantExpr = function(cl,c,p) {
	var _g = cl.constants[c];
	var all = _g;
	switch(_g[1]) {
	case 0:
		var s = _g[2];
		return { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CString(s)), pos : p};
	case 6:
		var i = _g[2];
		return format.jclass.Tools.constantExpr(cl,i,p);
	case 1:
		var i = _g[2];
		return { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CInt(Std.string(i))), pos : p};
	case 3:
		var f = _g[2];
		return { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CFloat(Std.string(f))), pos : p};
	case 4:
		var f = _g[2];
		return { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CFloat(Std.string(f))), pos : p};
	case 2:
		var i = _g[2];
		var a = { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CInt(Std.string(haxe.Int64.getHigh(i)))), pos : p};
		var b = { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CInt(Std.string(haxe.Int64.getLow(i)))), pos : p};
		return { expr : haxe.macro.ExprDef.ECall({ expr : haxe.macro.ExprDef.EField({ expr : haxe.macro.ExprDef.EField({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("haxe")), pos : { file : "./format/jclass/Tools.hx", min : 4629, max : 4633}},"Int64"), pos : { file : "./format/jclass/Tools.hx", min : 4629, max : 4639}},"make"), pos : { file : "./format/jclass/Tools.hx", min : 4629, max : 4644}},[a,b]), pos : { file : "./format/jclass/Tools.hx", min : 4629, max : 4652}};
	default:
		throw "Cannot resolve constant " + Std.string(all);
	}
}
format.jclass.Tools.toString = function(c) {
	var name = format.jclass.Tools.resolveConstant(c,c.thisId);
	var superName = format.jclass.Tools.resolveConstant(c,c.superId);
	console.log(c.interfaces);
	return "" + name + " extends " + superName;
}
var haxe = {}
haxe.Int64 = function(high,low) {
	this.high = high | 0;
	this.low = low | 0;
};
$hxClasses["haxe.Int64"] = haxe.Int64;
haxe.Int64.__name__ = true;
haxe.Int64.getLow = function(x) {
	return x.low;
}
haxe.Int64.getHigh = function(x) {
	return x.high;
}
haxe.Int64.sub = function(a,b) {
	var high = a.high - b.high;
	var low = a.low - b.low;
	if(haxe.Int64.uicompare(a.low,b.low) < 0) high--;
	return new haxe.Int64(high,low);
}
haxe.Int64.divMod = function(modulus,divisor) {
	var quotient = new haxe.Int64(0,0);
	var mask_high = 0, mask_low = 1;
	divisor = new haxe.Int64(divisor.high,divisor.low);
	while(divisor.high >= 0) {
		var cmp = haxe.Int64.ucompare(divisor,modulus);
		divisor.high = divisor.high << 1 | divisor.low >>> 31;
		divisor.low <<= 1;
		mask_high = mask_high << 1 | mask_low >>> 31;
		mask_low <<= 1;
		if(cmp >= 0) break;
	}
	while((mask_low | mask_high) != 0) {
		if(haxe.Int64.ucompare(modulus,divisor) >= 0) {
			quotient.high |= mask_high;
			quotient.low |= mask_low;
			modulus = haxe.Int64.sub(modulus,divisor);
		}
		mask_low = mask_low >>> 1 | mask_high << 31;
		mask_high >>>= 1;
		divisor.low = divisor.low >>> 1 | divisor.high << 31;
		divisor.high >>>= 1;
	}
	return { quotient : quotient, modulus : modulus};
}
haxe.Int64.neg = function(a) {
	var high = ~a.high;
	var low = -a.low;
	if(low == 0) high++;
	return new haxe.Int64(high,low);
}
haxe.Int64.uicompare = function(a,b) {
	if(a < 0) {
		if(b < 0) return ~b - ~a; else return 1;
	} else if(b < 0) return -1; else return a - b;
}
haxe.Int64.ucompare = function(a,b) {
	var v = haxe.Int64.uicompare(a.high,b.high);
	if(v != 0) return v; else return haxe.Int64.uicompare(a.low,b.low);
}
haxe.Int64.prototype = {
	toString: function() {
		if((this.high | this.low) == 0) return "0";
		var str = "";
		var neg = false;
		var i = this;
		if(i.high < 0) {
			neg = true;
			i = haxe.Int64.neg(i);
		}
		var ten = new haxe.Int64(0,10);
		while(!((i.high | i.low) == 0)) {
			var r = haxe.Int64.divMod(i,ten);
			str = r.modulus.low + str;
			i = r.quotient;
		}
		if(neg) str = "-" + str;
		return str;
	}
	,__class__: haxe.Int64
}
haxe.Resource = function() { }
$hxClasses["haxe.Resource"] = haxe.Resource;
haxe.Resource.__name__ = true;
haxe.Resource.getBytes = function(name) {
	var _g = 0;
	var _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return haxe.io.Bytes.ofString(x.str);
			return haxe.Unserializer.run(x.data);
		}
	}
	return null;
}
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = true;
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0;
	var _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		var _g = this.buf.charCodeAt(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new haxe.ds.IntMap();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntMap format";
			return h;
		case 77:
			var h = new haxe.ds.ObjectMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size;
			size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,__class__: haxe.Unserializer
}
haxe.ds = {}
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,__class__: haxe.ds.IntMap
}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id;
		if(key.__id__ != null) id = key.__id__; else id = key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a[i] = 0;
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var o = 0;
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a[o++] = c; else if(c <= 2047) {
			a[o++] = 192 | c >> 6;
			a[o++] = 128 | c & 63;
		} else if(c <= 65535) {
			a[o++] = 224 | c >> 12;
			a[o++] = 128 | c >> 6 & 63;
			a[o++] = 128 | c & 63;
		} else {
			a[o++] = 240 | c >> 18;
			a[o++] = 128 | c >> 12 & 63;
			a[o++] = 128 | c >> 6 & 63;
			a[o++] = 128 | c & 63;
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.prototype = {
	toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
$hxClasses["haxe.io.BytesBuffer"] = haxe.io.BytesBuffer;
haxe.io.BytesBuffer.__name__ = true;
haxe.io.BytesBuffer.prototype = {
	getBytes: function() {
		var bytes = haxe.io.Bytes.alloc(this.b.length);
		var _g1 = 0;
		var _g = this.b.length;
		while(_g1 < _g) {
			var i = _g1++;
			bytes[i] = this.b[i];
		}
		this.b = null;
		return bytes;
	}
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = function() { }
$hxClasses["haxe.io.Input"] = haxe.io.Input;
haxe.io.Input.__name__ = true;
haxe.io.Input.prototype = {
	getDoubleSig: function(bytes) {
		return ((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * 4294967296. + (bytes[4] >> 7) * 2147483648 + ((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]);
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24; else return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) return ch2 | ch1 << 8; else return ch1 | ch2 << 8;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n;
		if(this.bigEndian) n = ch2 | ch1 << 8; else n = ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) return n - 256;
		return n;
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readFloat: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
		var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
		if(sig == 0 && exp == -127) return 0.0;
		return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function() {
		throw "Not implemented";
	}
	,__class__: haxe.io.Input
}
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe.io.BytesInput;
haxe.io.BytesInput.__name__ = true;
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,__class__: haxe.io.BytesInput
});
haxe.io.Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.macro = {}
haxe.macro.Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : true, __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] }
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : true, __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] }
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; }
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : true, __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] }
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : true, __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] }
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ComplexType = $hxClasses["haxe.macro.ComplexType"] = { __ename__ : true, __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] }
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.TypeParam = $hxClasses["haxe.macro.TypeParam"] = { __ename__ : true, __constructs__ : ["TPType","TPExpr"] }
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.Access = $hxClasses["haxe.macro.Access"] = { __ename__ : true, __constructs__ : ["APublic","APrivate","AStatic","AOverride","ADynamic","AInline","AMacro"] }
haxe.macro.Access.APublic = ["APublic",0];
haxe.macro.Access.APublic.toString = $estr;
haxe.macro.Access.APublic.__enum__ = haxe.macro.Access;
haxe.macro.Access.APrivate = ["APrivate",1];
haxe.macro.Access.APrivate.toString = $estr;
haxe.macro.Access.APrivate.__enum__ = haxe.macro.Access;
haxe.macro.Access.AStatic = ["AStatic",2];
haxe.macro.Access.AStatic.toString = $estr;
haxe.macro.Access.AStatic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AOverride = ["AOverride",3];
haxe.macro.Access.AOverride.toString = $estr;
haxe.macro.Access.AOverride.__enum__ = haxe.macro.Access;
haxe.macro.Access.ADynamic = ["ADynamic",4];
haxe.macro.Access.ADynamic.toString = $estr;
haxe.macro.Access.ADynamic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AInline = ["AInline",5];
haxe.macro.Access.AInline.toString = $estr;
haxe.macro.Access.AInline.__enum__ = haxe.macro.Access;
haxe.macro.Access.AMacro = ["AMacro",6];
haxe.macro.Access.AMacro.toString = $estr;
haxe.macro.Access.AMacro.__enum__ = haxe.macro.Access;
haxe.macro.FieldType = $hxClasses["haxe.macro.FieldType"] = { __ename__ : true, __constructs__ : ["FVar","FFun","FProp"] }
haxe.macro.FieldType.FVar = function(t,e) { var $x = ["FVar",0,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FFun = function(f) { var $x = ["FFun",1,f]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FProp = function(get,set,t,e) { var $x = ["FProp",2,get,set,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind = $hxClasses["haxe.macro.TypeDefKind"] = { __ename__ : true, __constructs__ : ["TDEnum","TDStructure","TDClass","TDAlias","TDAbstract"] }
haxe.macro.TypeDefKind.TDEnum = ["TDEnum",0];
haxe.macro.TypeDefKind.TDEnum.toString = $estr;
haxe.macro.TypeDefKind.TDEnum.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDStructure = ["TDStructure",1];
haxe.macro.TypeDefKind.TDStructure.toString = $estr;
haxe.macro.TypeDefKind.TDStructure.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDClass = function(superClass,interfaces,isInterface) { var $x = ["TDClass",2,superClass,interfaces,isInterface]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind.TDAlias = function(t) { var $x = ["TDAlias",3,t]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind.TDAbstract = function(tthis,from,to) { var $x = ["TDAbstract",4,tthis,from,to]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.Printer = function(tabString) {
	if(tabString == null) tabString = "\t";
	this.tabs = "";
	this.tabString = tabString;
};
$hxClasses["haxe.macro.Printer"] = haxe.macro.Printer;
haxe.macro.Printer.__name__ = true;
haxe.macro.Printer.prototype = {
	opt: function(v,f,prefix) {
		if(prefix == null) prefix = "";
		if(v == null) return ""; else return prefix + f(v);
	}
	,printTypeDefinition: function(t,printPackage) {
		if(printPackage == null) printPackage = true;
		var old = this.tabs;
		this.tabs = this.tabString;
		var str;
		if(t == null) str = "#NULL"; else str = (printPackage && t.pack.length > 0 && t.pack[0] != ""?"package " + t.pack.join(".") + ";\n":"") + (t.meta != null && t.meta.length > 0?t.meta.map($bind(this,this.printMetadata)).join(" ") + " ":"") + (t.isExtern?"extern ":"") + (function($this) {
			var $r;
			switch(t.kind[1]) {
			case 0:
				$r = "enum " + t.name + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(", ") + ">":"") + " {\n" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = t.fields;
						while(_g1 < _g2.length) {
							var field = _g2[_g1];
							++_g1;
							_g.push($this.tabs + (field.doc != null && field.doc != ""?"/**\n" + $this.tabs + $this.tabString + StringTools.replace(field.doc,"\n","\n" + $this.tabs + $this.tabString) + "\n" + $this.tabs + "**/\n" + $this.tabs:"") + (field.meta != null && field.meta.length > 0?field.meta.map($bind($this,$this.printMetadata)).join(" ") + " ":"") + (function($this) {
								var $r;
								switch(field.kind[1]) {
								case 0:
									$r = field.name;
									break;
								case 2:
									$r = (function($this) {
										var $r;
										throw "FProp is invalid for TDEnum.";
										return $r;
									}($this));
									break;
								case 1:
									$r = (function($this) {
										var $r;
										var func = field.kind[2];
										$r = field.name + $this.printFunction(func);
										return $r;
									}($this));
									break;
								}
								return $r;
							}($this)) + ";");
						}
					}
					$r = _g;
					return $r;
				}($this))).join("\n") + "\n}";
				break;
			case 1:
				$r = "typedef " + t.name + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(", ") + ">":"") + " = {\n" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = t.fields;
						while(_g1 < _g2.length) {
							var f = _g2[_g1];
							++_g1;
							_g.push($this.tabs + $this.printField(f) + ";");
						}
					}
					$r = _g;
					return $r;
				}($this))).join("\n") + "\n}";
				break;
			case 2:
				$r = (function($this) {
					var $r;
					var isInterface = t.kind[4];
					var interfaces = t.kind[3];
					var superClass = t.kind[2];
					$r = (isInterface?"interface ":"class ") + t.name + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(", ") + ">":"") + (superClass != null?" extends " + $this.printTypePath(superClass):"") + (interfaces != null?(isInterface?(function($this) {
						var $r;
						var _g = [];
						{
							var _g1 = 0;
							while(_g1 < interfaces.length) {
								var tp = interfaces[_g1];
								++_g1;
								_g.push(" extends " + $this.printTypePath(tp));
							}
						}
						$r = _g;
						return $r;
					}($this)):(function($this) {
						var $r;
						var _g1 = [];
						{
							var _g2 = 0;
							while(_g2 < interfaces.length) {
								var tp = interfaces[_g2];
								++_g2;
								_g1.push(" implements " + $this.printTypePath(tp));
							}
						}
						$r = _g1;
						return $r;
					}($this))).join(""):"") + " {\n" + ((function($this) {
						var $r;
						var _g2 = [];
						{
							var _g3 = 0;
							var _g4 = t.fields;
							while(_g3 < _g4.length) {
								var f = _g4[_g3];
								++_g3;
								_g2.push((function($this) {
									var $r;
									var fstr = $this.printField(f);
									$r = $this.tabs + fstr + (function($this) {
										var $r;
										switch(f.kind[1]) {
										case 0:case 2:
											$r = ";";
											break;
										case 1:
											$r = (function($this) {
												var $r;
												var func = f.kind[2];
												$r = func.expr == null?";":"";
												return $r;
											}($this));
											break;
										default:
											$r = "";
										}
										return $r;
									}($this));
									return $r;
								}($this)));
							}
						}
						$r = _g2;
						return $r;
					}($this))).join("\n") + "\n}";
					return $r;
				}($this));
				break;
			case 3:
				$r = (function($this) {
					var $r;
					var ct = t.kind[2];
					$r = "typedef " + t.name + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(", ") + ">":"") + " = " + $this.printComplexType(ct) + ";";
					return $r;
				}($this));
				break;
			case 4:
				$r = (function($this) {
					var $r;
					var to = t.kind[4];
					var from = t.kind[3];
					var tthis = t.kind[2];
					$r = "abstract " + t.name + (tthis == null?"":"(" + $this.printComplexType(tthis) + ")") + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(", ") + ">":"") + (from == null?"":((function($this) {
						var $r;
						var _g = [];
						{
							var _g1 = 0;
							while(_g1 < from.length) {
								var f = from[_g1];
								++_g1;
								_g.push(" from " + $this.printComplexType(f));
							}
						}
						$r = _g;
						return $r;
					}($this))).join("")) + (to == null?"":((function($this) {
						var $r;
						var _g1 = [];
						{
							var _g2 = 0;
							while(_g2 < to.length) {
								var t1 = to[_g2];
								++_g2;
								_g1.push(" to " + $this.printComplexType(t1));
							}
						}
						$r = _g1;
						return $r;
					}($this))).join("")) + " {\n" + ((function($this) {
						var $r;
						var _g2 = [];
						{
							var _g3 = 0;
							var _g4 = t.fields;
							while(_g3 < _g4.length) {
								var f = _g4[_g3];
								++_g3;
								_g2.push((function($this) {
									var $r;
									var fstr = $this.printField(f);
									$r = $this.tabs + fstr + (function($this) {
										var $r;
										switch(f.kind[1]) {
										case 0:case 2:
											$r = ";";
											break;
										case 1:
											$r = (function($this) {
												var $r;
												var func = f.kind[2];
												$r = func.expr == null?";":"";
												return $r;
											}($this));
											break;
										default:
											$r = "";
										}
										return $r;
									}($this));
									return $r;
								}($this)));
							}
						}
						$r = _g2;
						return $r;
					}($this))).join("\n") + "\n}";
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this));
		this.tabs = old;
		return str;
	}
	,printExprs: function(el,sep) {
		return el.map($bind(this,this.printExpr)).join(sep);
	}
	,printExpr: function(e) {
		var _g = this;
		if(e == null) return "#NULL"; else switch(e.expr[1]) {
		case 0:
			var c = e.expr[2];
			return this.printConstant(c);
		case 1:
			var e2 = e.expr[3];
			var e1 = e.expr[2];
			return "" + this.printExpr(e1) + "[" + this.printExpr(e2) + "]";
		case 2:
			var e2 = e.expr[4];
			var e1 = e.expr[3];
			var op = e.expr[2];
			return "" + this.printExpr(e1) + " " + this.printBinop(op) + " " + this.printExpr(e2);
		case 3:
			var n = e.expr[3];
			var e1 = e.expr[2];
			return "" + this.printExpr(e1) + "." + n;
		case 4:
			var e1 = e.expr[2];
			return "(" + this.printExpr(e1) + ")";
		case 5:
			var fl = e.expr[2];
			return "{ " + fl.map(function(fld) {
				return "" + fld.field + " : " + _g.printExpr(fld.expr) + " ";
			}).join(",") + "}";
		case 6:
			var el = e.expr[2];
			return "[" + this.printExprs(el,", ") + "]";
		case 7:
			var el = e.expr[3];
			var e1 = e.expr[2];
			return "" + this.printExpr(e1) + "(" + this.printExprs(el,", ") + ")";
		case 8:
			var el = e.expr[3];
			var tp = e.expr[2];
			return "new " + this.printTypePath(tp) + "(" + this.printExprs(el,", ") + ")";
		case 9:
			switch(e.expr[3]) {
			case true:
				var e1 = e.expr[4];
				var op = e.expr[2];
				return this.printExpr(e1) + this.printUnop(op);
			case false:
				var e1 = e.expr[4];
				var op = e.expr[2];
				return this.printUnop(op) + this.printExpr(e1);
			}
			break;
		case 11:
			var func = e.expr[3];
			var no = e.expr[2];
			if(no != null) return "function " + no + this.printFunction(func); else {
				var func1 = e.expr[3];
				return "function " + this.printFunction(func1);
			}
			break;
		case 10:
			var vl = e.expr[2];
			return "var " + vl.map($bind(this,this.printVar)).join(", ");
		case 12:
			var el = e.expr[2];
			switch(e.expr[2].length) {
			case 0:
				return "{\n" + this.tabs + "}";
			default:
				var old = this.tabs;
				this.tabs += this.tabString;
				var s = "{\n" + this.tabs + this.printExprs(el,";\n" + this.tabs);
				this.tabs = old;
				return s + (";\n" + this.tabs + "}");
			}
			break;
		case 13:
			var e2 = e.expr[3];
			var e1 = e.expr[2];
			return "for(" + this.printExpr(e1) + ") " + this.printExpr(e2);
		case 14:
			var e2 = e.expr[3];
			var e1 = e.expr[2];
			return "" + this.printExpr(e1) + " in " + this.printExpr(e2);
		case 15:
			var eelse = e.expr[4];
			var eif = e.expr[3];
			var econd = e.expr[2];
			return "if(" + this.printExpr(econd) + ") " + this.printExpr(eif) + " " + this.opt(eelse,$bind(this,this.printExpr),"else ");
		case 16:
			switch(e.expr[4]) {
			case true:
				var econd = e.expr[2];
				var e1 = e.expr[3];
				return "while(" + this.printExpr(econd) + ") " + this.printExpr(e1);
			case false:
				var econd = e.expr[2];
				var e1 = e.expr[3];
				return "do " + this.printExpr(e1) + " while(" + this.printExpr(econd) + ")";
			}
			break;
		case 17:
			var edef = e.expr[4];
			var cl = e.expr[3];
			var e1 = e.expr[2];
			var old = this.tabs;
			this.tabs += this.tabString;
			var s = "switch " + this.printExpr(e1) + " {\n" + this.tabs + cl.map(function(c) {
				return "case " + _g.printExprs(c.values,", ") + (c.guard != null?" if(" + _g.printExpr(c.guard) + "): ":":") + (c.expr != null?_g.opt(c.expr,$bind(_g,_g.printExpr)) + ";":"");
			}).join("\n" + this.tabs);
			if(edef != null) s += "\n" + this.tabs + "default: " + (edef.expr == null?"":this.printExpr(edef)) + ";";
			this.tabs = old;
			return s + ("\n" + this.tabs + "}");
		case 18:
			var cl = e.expr[3];
			var e1 = e.expr[2];
			return "try " + this.printExpr(e1) + cl.map(function(c) {
				return " catch(" + c.name + " : " + _g.printComplexType(c.type) + ") " + _g.printExpr(c.expr);
			}).join("");
		case 19:
			var eo = e.expr[2];
			return "return" + this.opt(eo,$bind(this,this.printExpr)," ");
		case 20:
			return "break";
		case 21:
			return "continue";
		case 22:
			var e1 = e.expr[2];
			return "untyped " + this.printExpr(e1);
		case 23:
			var e1 = e.expr[2];
			return "throw " + this.printExpr(e1);
		case 24:
			var cto = e.expr[3];
			var e1 = e.expr[2];
			if(cto != null) return "cast(" + this.printExpr(e1) + ", " + this.printComplexType(cto) + ")"; else {
				var e11 = e.expr[2];
				return "cast " + this.printExpr(e11);
			}
			break;
		case 25:
			var e1 = e.expr[2];
			return "#DISPLAY(" + this.printExpr(e1) + ")";
		case 26:
			var tp = e.expr[2];
			return "#DISPLAY(" + this.printTypePath(tp) + ")";
		case 27:
			var eelse = e.expr[4];
			var eif = e.expr[3];
			var econd = e.expr[2];
			return "" + this.printExpr(econd) + " ? " + this.printExpr(eif) + " : " + this.printExpr(eelse);
		case 28:
			var ct = e.expr[3];
			var e1 = e.expr[2];
			return "#CHECK_TYPE(" + this.printExpr(e1) + ", " + this.printComplexType(ct) + ")";
		case 29:
			var e1 = e.expr[3];
			var meta = e.expr[2];
			return this.printMetadata(meta) + " " + this.printExpr(e1);
		}
	}
	,printVar: function(v) {
		return v.name + this.opt(v.type,$bind(this,this.printComplexType)," : ") + this.opt(v.expr,$bind(this,this.printExpr)," = ");
	}
	,printFunction: function(func) {
		return (func.params.length > 0?"<" + func.params.map($bind(this,this.printTypeParamDecl)).join(", ") + ">":"") + "( " + func.args.map($bind(this,this.printFunctionArg)).join(", ") + " )" + this.opt(func.ret,$bind(this,this.printComplexType)," : ") + this.opt(func.expr,$bind(this,this.printExpr)," ");
	}
	,printFunctionArg: function(arg) {
		return (arg.opt?"?":"") + arg.name + this.opt(arg.type,$bind(this,this.printComplexType)," : ") + this.opt(arg.value,$bind(this,this.printExpr)," = ");
	}
	,printTypeParamDecl: function(tpd) {
		return tpd.name + (tpd.params != null && tpd.params.length > 0?"<" + tpd.params.map($bind(this,this.printTypeParamDecl)).join(", ") + ">":"") + (tpd.constraints != null && tpd.constraints.length > 0?":(" + tpd.constraints.map($bind(this,this.printComplexType)).join(", ") + ")":"");
	}
	,printField: function(field) {
		return (field.doc != null && field.doc != ""?"/**\n" + this.tabs + this.tabString + StringTools.replace(field.doc,"\n","\n" + this.tabs + this.tabString) + "\n" + this.tabs + "**/\n" + this.tabs:"") + (field.meta != null && field.meta.length > 0?field.meta.map($bind(this,this.printMetadata)).join(" ") + " ":"") + (field.access != null && field.access.length > 0?field.access.map($bind(this,this.printAccess)).join(" ") + " ":"") + (function($this) {
			var $r;
			switch(field.kind[1]) {
			case 0:
				$r = (function($this) {
					var $r;
					var eo = field.kind[3];
					var t = field.kind[2];
					$r = "var " + field.name + $this.opt(t,$bind($this,$this.printComplexType)," : ") + $this.opt(eo,$bind($this,$this.printExpr)," = ");
					return $r;
				}($this));
				break;
			case 2:
				$r = (function($this) {
					var $r;
					var eo = field.kind[5];
					var t = field.kind[4];
					var set = field.kind[3];
					var get = field.kind[2];
					$r = "var " + field.name + "(" + get + ", " + set + ")" + $this.opt(t,$bind($this,$this.printComplexType)," : ") + $this.opt(eo,$bind($this,$this.printExpr)," = ");
					return $r;
				}($this));
				break;
			case 1:
				$r = (function($this) {
					var $r;
					var func = field.kind[2];
					$r = "function " + field.name + $this.printFunction(func);
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this));
	}
	,printAccess: function(access) {
		switch(access[1]) {
		case 2:
			return "static";
		case 0:
			return "public";
		case 1:
			return "private";
		case 3:
			return "override";
		case 5:
			return "inline";
		case 4:
			return "dynamic";
		case 6:
			return "macro";
		}
	}
	,printMetadata: function(meta) {
		return "@" + meta.name + (meta.params.length > 0?"(" + this.printExprs(meta.params,", ") + ")":"");
	}
	,printComplexType: function(ct) {
		switch(ct[1]) {
		case 0:
			var tp = ct[2];
			return this.printTypePath(tp);
		case 1:
			var ret = ct[3];
			var args = ct[2];
			return (args.length > 0?args.map($bind(this,this.printComplexType)).join(" -> "):"Void") + " -> " + this.printComplexType(ret);
		case 2:
			var fields = ct[2];
			return "{ " + ((function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					while(_g1 < fields.length) {
						var f = fields[_g1];
						++_g1;
						_g.push($this.printField(f) + "; ");
					}
				}
				$r = _g;
				return $r;
			}(this))).join("") + "}";
		case 3:
			var ct1 = ct[2];
			return "(" + this.printComplexType(ct1) + ")";
		case 5:
			var ct1 = ct[2];
			return "?" + this.printComplexType(ct1);
		case 4:
			var fields = ct[3];
			var tp = ct[2];
			return "{" + this.printTypePath(tp) + " >, " + fields.map($bind(this,this.printField)).join(", ") + " }";
		}
	}
	,printTypePath: function(tp) {
		return (tp.pack.length > 0?tp.pack.join(".") + ".":"") + tp.name + (tp.sub != null?"." + tp.sub:"") + (tp.params.length > 0?"<" + tp.params.map($bind(this,this.printTypeParam)).join(", ") + ">":"");
	}
	,printTypeParam: function(param) {
		switch(param[1]) {
		case 0:
			var ct = param[2];
			return this.printComplexType(ct);
		case 1:
			var e = param[2];
			return this.printExpr(e);
		}
	}
	,printConstant: function(c) {
		switch(c[1]) {
		case 2:
			var s = c[2];
			return "\"" + StringTools.replace(s,"\"","\"") + "\"";
		case 3:
			var s = c[2];
			return s;
		case 0:
			var s = c[2];
			return s;
		case 1:
			var s = c[2];
			return s;
		case 4:
			var opt = c[3];
			var s = c[2];
			return "~/" + s + "/" + opt;
		}
	}
	,printBinop: function(op) {
		switch(op[1]) {
		case 0:
			return "+";
		case 1:
			return "*";
		case 2:
			return "/";
		case 3:
			return "-";
		case 4:
			return "=";
		case 5:
			return "==";
		case 6:
			return "!=";
		case 7:
			return ">";
		case 8:
			return ">=";
		case 9:
			return "<";
		case 10:
			return "<=";
		case 11:
			return "&";
		case 12:
			return "|";
		case 13:
			return "^";
		case 14:
			return "&&";
		case 15:
			return "||";
		case 16:
			return "<<";
		case 17:
			return ">>";
		case 18:
			return ">>>";
		case 19:
			return "%";
		case 21:
			return "...";
		case 22:
			return "=>";
		case 20:
			var op1 = op[2];
			return this.printBinop(op1) + "=";
		}
	}
	,printUnop: function(op) {
		switch(op[1]) {
		case 0:
			return "++";
		case 1:
			return "--";
		case 2:
			return "!";
		case 3:
			return "-";
		case 4:
			return "~";
		}
	}
	,__class__: haxe.macro.Printer
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = true;
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
haxe.Resource.content = [{ name : "classfile", data : "s632:yv66vgAAADMAIAoABgASCQATABQIABUKABYAFwcAGAcAGQEAA3N0cgEAEkxqYXZhL2xhbmcvU3RyaW5nOwEADUNvbnN0YW50VmFsdWUBAAY8aW5pdD4BAAMoKVYBAARDb2RlAQAPTGluZU51bWJlclRhYmxlAQAEbWFpbgEAFihbTGphdmEvbGFuZy9TdHJpbmc7KVYBAApTb3VyY2VGaWxlAQAJVGVzdC5qYXZhDAAKAAsHABoMABsAHAEADUhlbGxvLCB3b3JsZCEHAB0MAB4AHwEABFRlc3QBABBqYXZhL2xhbmcvT2JqZWN0AQAQamF2YS9sYW5nL1N5c3RlbQEAA291dAEAFUxqYXZhL2lvL1ByaW50U3RyZWFtOwEAE2phdmEvaW8vUHJpbnRTdHJlYW0BAAdwcmludGxuAQAVKExqYXZhL2xhbmcvU3RyaW5nOylWACEABQAGAAAAAQAZAAcACAABAAkAAAACAAMAAgABAAoACwABAAwAAAAdAAEAAQAAAAUqtwABsQAAAAEADQAAAAYAAQAAAAEACQAOAA8AAQAMAAAAJQACAAEAAAAJsgACEgO2AASxAAAAAQANAAAACgACAAAABAAIAAUAAQAQAAAAAgAR"}];
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
TestClass.main();
})();

//# sourceMappingURL=test_class.js.map