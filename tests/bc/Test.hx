class Test {
	public static function main() {
		var res = haxe.Resource.getBytes("classfile");
		var r = new format.bc.Reader(new haxe.io.BytesInput(res));
		trace(r.read());
	}
}