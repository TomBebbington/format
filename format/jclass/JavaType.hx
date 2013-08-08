package format.jclass;
using StringTools;
enum JavaTypeData {
	Byte;
	Char;
	Double;
	Float;
	Int;
	Long;
	Instance(c:String);
	Short;
	Boolean;
	Void;
	Array(t:JavaTypeData);
	Method(args:Array<JavaType>, ret:JavaType);
}
abstract JavaType(JavaTypeData) from JavaTypeData to JavaTypeData {
	@:from public static function parse(s:String):JavaTypeData {
		return switch(s.fastCodeAt(0)) {
			case "B".code: Byte;
			case "C".code: Char;
			case "D".code: Double;
			case "F".code: Float;
			case "I".code: Int;
			case "J".code: Long;
			case "L".code: Instance(s.indexOf(";") == -1 ? s.substr(1) : s.substr(0, s.indexOf(";")));
			case "S".code: Short;
			case "Z".code: Boolean;
			case "[".code: Array(parse(s.substr(1).trim()));
			case "V".code: Void;
			case "(".code:
				var ind = 1;
				var curr = null;
				var argsStr = s.substring(s.indexOf("(")+1, s.indexOf(")"));
				var args = [for(arg in argsStr.split(";")) if(arg.length > 0) parse(arg)];
				var ret = parse(s.substr(s.indexOf(")")+1));
				Method(args, ret);
			default: throw "Invalid java type: "+s;
		};
	}
}