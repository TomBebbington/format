package format.jclass;
typedef Version = {
	var minor:Int;
	var major:Int;
}
typedef Field = {
	var accessFlags:Array<FieldAccessFlag>;
	var nameIndex:Int;
	var descriptorIndex:Int;
	var attributes:Array<Attribute>;
}
typedef Method = {
	var accessFlags:Array<MethodAccessFlag>;
	var nameIndex:Int;
	var descriptorIndex:Int;
	var attributes:Array<Attribute>;
}
typedef TryCatch = {
	var startPc:Int;
	var endPc:Int;
	var handlerPc:Int;
	var catchType:Ref;
}
typedef Code = {
	var maxStack:Int;
	var maxLocals:Int;
	var code:Array<Instruction>;
	var trys:Array<TryCatch>;
	var attributes:Array<Attribute>;
}
enum Instruction {
	AConstNull; // 0x01
	IConst(v:Int);
	LConst(v:haxe.Int64);
	FConst(v:Float);
	DConst(v:Float);
	BiPush(v:Int);
	SiPush(v:Int);
	Ldc(r:Ref);
	Ldc2(r:Ref);
	ILoad(i:Int);
	LLoad(i:Int);
	FLoad(i:Int);
	DLoad(i:Int);
	ALoad(i:Int);
	IALoad;
	LALoad;
	FALoad;
	DALoad;
	AALoad;
	BALoad;
	CALoad;
	SALoad;
	IStore(v:Int);
	LStore(v:Int);
	FStore(v:Int);
	DStore(v:Int);
	AStore(v:Int);
	IAStore;
	Goto(b:Int);
	IInc(i:Int, b:Int);
	IfICmpGe(b:Int);
	Dup;
	GetStatic(r:Ref);
	InvokeVirtual(m:Ref);
	InvokeSpecial(ind:Int);
	New(r:Ref);
	Return;
}
enum Attribute {
	Code(c:Code);
	Exceptions;
	ConstantValue(v:Ref);
	Synthetic;
	InnerClasses;
	SourceFile(s:String);
	Unknown(name:String, bytes:haxe.io.Bytes);
}
typedef Ref = Int;
enum Constant {
	Str(s:String);
	Int(i:Int);
	Long(i:haxe.Int64);
	Float(f:Float);
	Double(f:Float);
	ClassRef(i:Ref);
	StrRef(i:Ref);
	FieldRef(c:Ref, nt:Ref);
	MethodRef(c:Ref, nt:Ref);
	InterfRef(c:Ref, nt:Ref);
	NameAndType(n:Ref, t:Ref);
	MethodHandle(k:Ref, r:Ref);
	MethodType(r:Ref);
}
enum ClassAccessFlag {
	Public;
	Final;
	Super;
	Interface;
	Abstract;
	Synthetic;
	Annotation;
	Enum;
}
enum MethodAccessFlag {
	Public;
	Private;
	Protected;
	Static;
	Final;
	Synchronized;
	Bridge;
	VarArgs;
	Native;
	Abstract;
	Strict;
	Synthetic;
}
enum FieldAccessFlag {
	Public;
	Private;
	Protected;
	Static;
	Final;
	Volatile;
	Transient;
	Synthetic;
	Enum;
}
typedef JClass = {
	var version:Version;
	var constants:Array<Constant>;
	var accessFlags:Array<ClassAccessFlag>;
	var bitmask:Int;
	var thisId:Ref;
	var superId:Ref;
	var interfaces:Array<Int>;
	var fields:Array<Field>;
	var methods:Array<Method>;
}

typedef Data = JClass;