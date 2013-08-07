package format.ll;
enum Type {
	Void;
	Half;
	Float;
	Double;
	Int1;
	Int8;
	Int16;
	Int32;
	Function(ret:Type, params:Array<Type>);
	Pointer(ct:Type);
	Structure(ts:Array<Type>);
	Vector(len:Int, t:Type);
	Array(len:Int, t:Type);
}
enum ConstantValue {
	Boolean(v:Bool);
	Integer(v:Int);
	Float(v:Float);
	Null;
	Structure(v:Array<{type:Type, value:ConstantValue}>);
	Array(v:Array<{type:Type, value:ConstantValue}>);
	Vector(v:Array<{type:Type, value:ConstantValue}>);
	String(s:String);
	Zero;
}
typedef Constant = {
	var name:String;
	var isPrivate:Bool;
	var addr:Null<Int>;
	var type:Type;
	var value:ConstantValue;
}

typedef Module = {
	var constants:Array<Constant>;
}
typedef Data = Module;