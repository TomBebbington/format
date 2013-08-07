package format.ll;
import format.ll.Data;
@:public class Tools {
	static function typeToString(t:Type):String return switch(t) {
		case Void: "void";
		case Half: "half";
		case Float: "float";
		case Double: "double";
		case Int1: "i1";
		case Int8: "i8";
		case Int16: "i16";
		case Int32: "i32";
		case Function(ret, params): typeToString(ret) + " ("+params.map(typeToString).join(", ")+")";
		case Pointer(pt): typeToString(pt)+"*";
		case Structure(ts): "{ " + ts.map(typeToString).join(", ") + " }";
		case Vector(len, vt): '<$len x ${typeToString(vt)}>';
		case Array(len, vt): '[$len x ${typeToString(vt)}]';
	}
}