package format.jclass;
typedef Version = {
	var minor:Int;
	var major:Int;
}
typedef FieldInfo = {
	var owner:String;
	var name:String;
	var type:String;
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
	var catchType:ConstRef<Dynamic>;
}
typedef Code = {
	var maxStack:Int;
	var maxLocals:Int;
	var code:Array<Instruction>;
	var trys:Array<TryCatch>;
	var attributes:Array<Attribute>;
}
enum Instruction {
	NOp;
	AConstNull;
	IConst(v:Int);
	LConst(v:haxe.Int64);
	FConst(v:Float);
	DConst(v:Float);
	BiPush(v:Int);
	SiPush(v:Int);
	Ldc(r:ConstRef<Dynamic>);
	Ldc2(r:ConstRef<Dynamic>);
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
	LAStore;
	FAStore;
	DAStore;
	BAStore;
	CAStore;
	AAStore;
	SAStore;
	Goto(b:Int);
	IInc(i:Int, b:Int);
	IfICmpEq(b:Int);
	IfICmpNe(b:Int);
	IfICmpGe(b:Int);
	IfICmpGt(b:Int);
	IfICmpLe(b:Int);
	IfICmpLt(b:Int);
	IfACmpEq(b:Int);
	IfACmpNe(b:Int);
	IfNull(b:Int);
	IfEq(b:Int);
	IfGe(b:Int);
	IfGt(b:Int);
	IfLe(b:Int);
	IfNeq(b:Int);
	IfNonNull(b:Int);
	GetField(f:Int);
	PutField(f:Int);
	PutStatic(r:Int);
	InstanceOf(t:ConstRef<String>);
	ANewArray(t:ConstRef<String>);
	NewArray(t:ConstRef<String>);
	MultiANewArray(t:ConstRef<String>, dims:Int);
	ArrayLen;
	Dup;
	DupX1;
	DupX2;
	Dup2;
	Dup2X1;
	Dup2X2;
	Pop;
	Pop2;
	IOr;
	IAdd;
	DAdd;
	LSub;
	LMul;
	LDiv;
	DMul;
	DSub;
	DDiv;
	INeg;
	IReturn;
	FReturn;
	LReturn;
	AReturn;
	IDiv;
	FAdd;
	FMul;
	FNeg;
	FSub;
	FCmpl;
	FCmpg;
	FDiv;
	IAnd;
	IRem;
	IMul;
	IShl;
	IXor;
	LXor;
	I2L;
	I2S;
	LShl;
	LAdd;
	LAnd;
	LOr;
	LRem;
	FRem;
	DRem;
	IUShr;
	LUShr;
	IShr;
	LShr;
	LCmp;
	F2I;
	F2D;
	D2F;
	D2L;
	L2D;
	L2I;
	I2C;
	I2B;
	I2F;
	L2F;
	I2D;
	D2I;
	DCmpg;
	DCmpl;
	AThrow;
	CheckCast(t:ConstRef<String>);
	LookupSwitch(m:Map<Int, Int>, def:Int);
	TableSwitch(m:Map<Int, Int>, def:Int);
	GetStatic(r:ConstRef<NameAndTypeData>);
	InvokeVirtual(m:ConstRef<Dynamic>);
	InvokeSpecial(m:ConstRef<Dynamic>);
	InvokeStatic(m:ConstRef<Dynamic>);
	InvokeInterface(m:ConstRef<Dynamic>, ?len:Int);
	IfLt(b:Int);
	New(r:ConstRef<String>);
	Return;
	ReturnRef;
	MonitorEnter;
	MonitorExit;
}
enum Attribute {
	Code(c:Code);
	Exceptions;
	ConstantValue(v:ConstRef<Dynamic>);
	Synthetic;
	InnerClasses;
	SourceFile(s:String);
	Unknown(name:String, bytes:haxe.io.Bytes);
}
typedef ConstRef<T> = Int;
typedef NameAndTypeData = {
	var name: String;
	var type: String;
}
typedef MethodHandleData = {
	var kind:Int;
	var index:ConstRef<Dynamic>;
}
enum Constant {
	Utf8(s:String);
	Int(i:Int);
	Long(i:haxe.Int64);
	Float(f:Float);
	Double(f:Float);
	ClassRef(i:ConstRef<String>);
	StrRef(i:ConstRef<String>);
	FieldRef(c:ConstRef<String>, nt:ConstRef<NameAndTypeData>);
	MethodRef(c:ConstRef<String>, nt:ConstRef<NameAndTypeData>);
	InterfRef(c:ConstRef<String>, nt:ConstRef<NameAndTypeData>);
	NameAndType(n:ConstRef<String>, t:ConstRef<String>);
	MethodHandle(k:Int, r:ConstRef<Dynamic>);
	MethodType(r:ConstRef<String>);
	InvokeDynamic(mattr:Int, nat:ConstRef<NameAndTypeData>);
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
	var thisId:ConstRef<String>;
	var superId:ConstRef<String>;
	var interfaces:Array<Int>;
	var fields:Array<Field>;
	var methods:Array<Method>;
}

typedef Data = JClass;