import format.nds.Reader;
import sys.io.File;
class TestNds {
	static function main() {
		var g = new Reader(File.read("/home/tom/Games/Mario Kart DS.nds", true)).read();
		trace(g);
	}
}