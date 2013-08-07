package format.nds;

typedef Game = {
	var title:String;
	var gameCode:String;
	var makerCode:String;
	var unitcode:Int;
	var encryptionSeed:Int;
	var deviceCapacity:Int;
	var romVersion:Int;
	var flags:Int;
}