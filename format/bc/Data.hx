package format.bc;
enum BitstreamEntry {
    Error;
    EndBlock;
    SubBlock;
    Record;
}
enum Operand {
	Fixed(v:Int);
	VBR(v:Int);
}
typedef Data = {

}