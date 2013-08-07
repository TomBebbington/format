package format.neko;
import format.neko.Data;
import haxe.macro.Expr;
import haxe.macro.*;
class Tools {
	public static function dump(d:Data):String {
		var b = new StringBuf();
		b.add('nglobals: ${d.globals.length}\n');
		b.add('nfields: ${d.fields.length}\n');
		b.add('codesize: ${d.code.length}\n');
		b.add('GLOBALS:\n');
		var i =0;
		for(f in d.globals) {
			b.add("\t");
			b.add('${i++}: ');
			switch(f) {
				case GlobalVersion(v): b.add('Version $v');
				case GlobalVar(v): b.add('Var $v');
				case GlobalFunction(pos, nargs): b.add('Function at $pos with $nargs arg(s)');
				case GlobalDebug(i): b.add("Debug info");
				case GlobalString(s): b.add('String $s');
				case GlobalFloat(f): b.add('Float $f');
			}
			b.add("\n");
		}
		b.add("FIELDS:\n");
		for(f in d.fields)
			b.add('\t$f\n');
		return b.toString();
	}
}