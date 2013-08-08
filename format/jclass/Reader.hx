package format.jclass;
import haxe.io.*;
import format.jclass.Data;
import haxe.Int64;
class Reader {
	var i:Input;
	public function new(i:Input) {
		this.i = i;
	}
	function readConstant():Constant {
		i.bigEndian = true;
		var bi = i.readByte();
		var c = switch(bi) {
			case 1: // utf8
				Constant.Utf8(haxe.Utf8.decode(i.readString(i.readUInt16())));
			case 3: // 32-bit int
				Constant.Int(i.readInt32());
			case 4: // 32-bit float
				Constant.Float(i.readFloat());
			case 5: // 64-bit int
				var high = i.readInt32();
				var low = i.readInt32();
				Constant.Long(haxe.Int64.make(high, low));
			case 6: // 64-bit double
				Constant.Double(i.readDouble());
			case 7: // class ref
				Constant.ClassRef(i.readUInt16());
			case 8: // string ref
				Constant.StrRef(i.readUInt16());
			case 9: // field ref
				var nt = i.readUInt16();
				Constant.FieldRef(nt, i.readUInt16());
			case 10: // method ref
				var nt = i.readUInt16();
				Constant.MethodRef(nt, i.readUInt16());
			case 11: // interface ref
				var nt = i.readUInt16();
				Constant.InterfRef(nt, i.readUInt16());
			case 12: // name and type
				var n = i.readUInt16();
				Constant.NameAndType(n, i.readUInt16());
			case 15: // method handle
				var kind = i.readByte();
				Constant.MethodHandle(kind, i.readUInt16());
			case 16: // method type
				Constant.MethodType(i.readUInt16());
			case 18: // invoke dynamic
				var bootstrap = i.readUInt16();
				Constant.InvokeDynamic(bootstrap, i.readUInt16());
			default: throw 'Unknown tag byte ${StringTools.hex(bi)}';
		};
		#if debug trace(c); #end
		return c;
	}
	function readAttribute(pool:Array<Constant>):Attribute {
		var name = pool[i.readUInt16()];
		if(name == null)
			throw "Could not find attribute name";
		var length = i.readInt32();
		return switch(name) {
			case Constant.Utf8(s):
				switch(s) {
					case "Code":
						var code:Dynamic = {};
						var maxStack = i.readUInt16();
						var maxLocals = i.readUInt16();
						var codel = i.readInt32();
						var codei = new haxe.io.BytesBuffer();
						while(codel-- > 0)
							codei.addByte(i.readByte());
						code.code = readInstructions(codei.getBytes());
						code.trys = [for(_ in 0...i.readUInt16()) {
							var startPc = i.readUInt16();
							var endPc = i.readUInt16();
							var handlerPc = i.readUInt16();
							var catchType = i.readUInt16();
							{startPc: startPc, endPc: endPc, handlerPc: handlerPc, catchType: catchType};
						}];
						code.attributes = [for(i in 0...i.readUInt16()) readAttribute(pool) ];
						Attribute.Code(cast code);
				case "Synthetic": Attribute.Synthetic;
				case "ConstantValue": 
					Attribute.ConstantValue(i.readUInt16());
				case "SourceFile": Attribute.SourceFile(i.readString(length));
				default: Attribute.Unknown(s,i.read(length));
			}
			default: throw "No name given for attribute";
		};

	}
	public function readInstructions(b:Bytes):Array<Instruction> {
		var i = new BytesInput(b);
		i.bigEndian = true;
		var a:Array<Instruction> = [];
		try while(true)
			a.push(switch(i.readByte()) {
				case 0x00: Instruction.NOp;
				case 0x01: Instruction.AConstNull;
				case 0x02: Instruction.IConst(-1);
				case 0x03: Instruction.IConst(0);
				case 0x04: Instruction.IConst(1);
				case 0x05: Instruction.IConst(2);
				case 0x06: Instruction.IConst(3);
				case 0x07: Instruction.IConst(4);
				case 0x08: Instruction.IConst(5);
				case 0x09: Instruction.LConst(Int64.ofInt(0));
				case 0x0A: Instruction.LConst(Int64.ofInt(1));
				case 0x0B: Instruction.FConst(0.0);
				case 0x0C: Instruction.FConst(1.0);
				case 0x0D: Instruction.FConst(2.0);
				case 0x0E: Instruction.DConst(0.0);
				case 0x0F: Instruction.DConst(1.0);
				case 0x10: Instruction.BiPush(i.readInt8());
				case 0x11: Instruction.SiPush(i.readInt16());
				case 0x12: Instruction.Ldc(i.readByte());
				case 0x13: Instruction.Ldc(i.readUInt16());
				case 0x14: Instruction.Ldc2(i.readUInt16());
				case 0x15: Instruction.ILoad(i.readByte());
				case 0x16: Instruction.LLoad(i.readByte());
				case 0x17: Instruction.FLoad(i.readByte());
				case 0x18: Instruction.DLoad(i.readByte());
				case 0x19: Instruction.ALoad(i.readByte());
				case 0x1A: Instruction.ILoad(0);
				case 0x1B: Instruction.ILoad(1);
				case 0x1C: Instruction.ILoad(2);
				case 0x1E: Instruction.ILoad(3);
				case 0x1D: Instruction.LLoad(0);
				case 0x1F: Instruction.LLoad(1);
				case 0x20: Instruction.LLoad(2);
				case 0x21: Instruction.LLoad(3);
				case 0x22: Instruction.FLoad(0);
				case 0x23: Instruction.FLoad(1);
				case 0x24: Instruction.FLoad(2);
				case 0x25: Instruction.FLoad(3);
				case 0x26: Instruction.DLoad(0);
				case 0x27: Instruction.DLoad(1);
				case 0x28: Instruction.DLoad(2);
				case 0x29: Instruction.DLoad(3);
				case 0x2A: Instruction.ALoad(0);
				case 0x2B: Instruction.ALoad(1);
				case 0x2C: Instruction.ALoad(2);
				case 0x2D: Instruction.ALoad(3);
				case 0x2E: Instruction.IALoad;
				case 0x2F: Instruction.LALoad;
				case 0x30: Instruction.FALoad;
				case 0x31: Instruction.DALoad;
				case 0x32: Instruction.FALoad;
				case 0x33: Instruction.BALoad;
				case 0x34: Instruction.CALoad;
				case 0x35: Instruction.SALoad;
				case 0x36: Instruction.IStore(i.readByte());
				case 0x37: Instruction.LStore(i.readByte());
				case 0x38: Instruction.FStore(i.readByte());
				case 0x39: Instruction.DStore(i.readByte());
				case 0x3A: Instruction.AStore(i.readByte());
				case 0x3B: Instruction.IStore(0);
				case 0x3C: Instruction.IStore(1);
				case 0x3D: Instruction.IStore(2);
				case 0x3E: Instruction.IStore(3);
				case 0x3F: Instruction.LStore(0);
				case 0x40: Instruction.LStore(1);
				case 0x41: Instruction.LStore(2);
				case 0x42: Instruction.LStore(3);
				case 0x43: Instruction.FStore(0);
				case 0x44: Instruction.FStore(1);
				case 0x45: Instruction.FStore(2);
				case 0x46: Instruction.FStore(3);
				case 0x47: Instruction.DStore(0);
				case 0x48: Instruction.DStore(1);
				case 0x49: Instruction.DStore(2);
				case 0x4A: Instruction.DStore(3);
				case 0x4B: Instruction.AStore(0);
				case 0x4C: Instruction.AStore(1);
				case 0x4D: Instruction.AStore(2);
				case 0x4E: Instruction.AStore(3);
				case 0x4F: Instruction.IAStore;
				case 0x50: Instruction.LAStore;
				case 0x51: Instruction.FAStore;
				case 0x52: Instruction.DAStore;
				case 0x53: Instruction.AAStore;
				case 0x54: Instruction.BAStore;
				case 0x55: Instruction.CAStore;
				case 0x56: Instruction.SAStore;
				case 0x57: Instruction.Pop;
				case 0x58: Instruction.Pop2;
				case 0x59: Instruction.Dup;
				case 0x5A: Instruction.DupX1;
				case 0x5B: Instruction.DupX2;
				case 0x5C: Instruction.Dup2;
				case 0x5D: Instruction.Dup2X1;
				case 0x5E: Instruction.Dup2X2;
				case 0x60: Instruction.IAdd;
				case 0x61: Instruction.LAdd;
				case 0x62: Instruction.FAdd;
				case 0x63: Instruction.DAdd;
				case 0x64: Instruction.DDiv;
				case 0x65: Instruction.LSub;
				case 0x66: Instruction.FSub;
				case 0x67: Instruction.DSub;
				case 0x68: Instruction.IMul;
				case 0x69: Instruction.LMul;
				case 0x6A: Instruction.FMul;
				case 0x6B: Instruction.DMul;
				case 0x6C: Instruction.IDiv;
				case 0x6D: Instruction.LDiv;
				case 0x6E: Instruction.FDiv;
				case 0x6F: Instruction.DDiv;
				case 0x70: Instruction.IRem;
				case 0x71: Instruction.LRem;
				case 0x72: Instruction.FRem;
				case 0x73: Instruction.DRem;
				case 0x74: Instruction.INeg;
				case 0x76: Instruction.FNeg;
				case 0x78: Instruction.IShl;
				case 0x79: Instruction.LShl;
				case 0x7A: Instruction.IShr;
				case 0x7B: Instruction.LShr;
				case 0x7C: Instruction.IUShr;
				case 0x7D: Instruction.LUShr;
				case 0x7E: Instruction.IAnd;
				case 0x7F: Instruction.LAnd;
				case 0x80: Instruction.IOr;
				case 0x81: Instruction.LOr;
				case 0x82: Instruction.IXor;
				case 0x83: Instruction.LXor;
				case 0x84: var ind = i.readByte(); Instruction.IInc(ind, i.readByte());
				case 0x85: Instruction.I2L;
				case 0x86: Instruction.I2F;
				case 0x87: Instruction.I2D;
				case 0x88: Instruction.L2I;
				case 0x89: Instruction.L2F;
				case 0x8A: Instruction.L2D;
				case 0x8B: Instruction.F2I;
				case 0x8D: Instruction.F2D;
				case 0x8E: Instruction.D2I;
				case 0x8F: Instruction.D2L;
				case 0x90: Instruction.D2F;
				case 0x91: Instruction.I2B;
				case 0x92: Instruction.I2C;
				case 0x93: Instruction.I2S;
				case 0x94: Instruction.LCmp;
				case 0x95: Instruction.FCmpl;
				case 0x96: Instruction.FCmpg;
				case 0x97: Instruction.DCmpl;
				case 0x98: Instruction.DCmpg;
				case 0x99: Instruction.IfEq(i.readUInt16());
				case 0x9A: Instruction.IfNeq(i.readUInt16());
				case 0x9B: Instruction.IfLt(i.readUInt16());
				case 0x9C: Instruction.IfGe(i.readUInt16());
				case 0x9D: Instruction.IfGt(i.readUInt16());
				case 0x9E: Instruction.IfLe(i.readUInt16());
				case 0x9F: Instruction.IfICmpEq(i.readUInt16());
				case 0xA0: Instruction.IfICmpNe(i.readUInt16());
				case 0xA1: Instruction.IfICmpLt(i.readUInt16());
				case 0xA2: Instruction.IfICmpGe(i.readUInt16());
				case 0xA3: Instruction.IfICmpGt(i.readUInt16());
				case 0xA4: Instruction.IfICmpLe(i.readUInt16());
				case 0xA5: Instruction.IfACmpEq(i.readUInt16());
				case 0xA6: Instruction.IfACmpNe(i.readUInt16());
				case 0xA7: Instruction.Goto(i.readUInt16());
				case 0xAA:
					while(i.position % 4 != 0)
						if(i.readByte() != 0) 
							throw "Invalid padding";
					var def = i.readInt32();
					var low = i.readInt32();
					var high = i.readInt32();
					var v = new Map<Int, Int>();
					for(n in 0...high - low + 1) {
						v.set(low + n, i.readInt32());
					}
					Instruction.TableSwitch(v, def);
				case 0xAB:
					while(i.position % 4 != 0)
						if(i.readByte() != 0)
							throw "Invalid padding";
					var def = i.readInt32();
					var npairs = i.readInt32();
					var map = new Map<Int, Int>();
					for(n in 0...npairs) {
						var key = i.readInt32();
						var value = i.readInt32();
						map.set(key, value);
					}
					Instruction.LookupSwitch(map, def);
				case 0xAC: Instruction.IReturn;
				case 0xAD: Instruction.LReturn;
				case 0xAE: Instruction.FReturn;
				case 0xAF: Instruction.AReturn;
				case 0xB0: Instruction.ReturnRef;
				case 0xB1: Instruction.Return;
				case 0xB2: Instruction.GetStatic(i.readUInt16());
				case 0xB3: Instruction.PutStatic(i.readUInt16());
				case 0xB4: Instruction.GetField(i.readUInt16());
				case 0xB5: Instruction.PutField(i.readUInt16());
				case 0xB6: Instruction.InvokeVirtual(i.readUInt16());
				case 0xB7: Instruction.InvokeSpecial(i.readUInt16());
				case 0xB8: Instruction.InvokeStatic(i.readUInt16());
				case 0xB9: 
					var index = i.readUInt16();
					var count = i.readByte();
					if(i.readByte() != 0) throw "Must be zero";
					Instruction.InvokeInterface(index, count);
				case 0xBB: Instruction.New(i.readUInt16());
				case 0xBC: Instruction.NewArray(i.readByte());
				case 0xBD: Instruction.ANewArray(i.readUInt16());
				case 0xBE: Instruction.ArrayLen;
				case 0xBF: Instruction.AThrow;
				case 0xC0: Instruction.CheckCast(i.readUInt16());
				case 0xC1: Instruction.InstanceOf(i.readUInt16());
				case 0xC2: Instruction.MonitorEnter;
				case 0xC3: Instruction.MonitorExit;
				case 0xC4: //wide
					var opcode = i.readByte();
					switch(opcode) {
						case 0x84:
							var a = i.readByte(); Instruction.IInc((a << 8 | i.readByte()), i.readByte());
						default: throw 'Unknown instruction: ${StringTools.hex(opcode, 2)}';
					}
				case 0xC5: var ind = i.readUInt16(); Instruction.MultiANewArray(ind, i.readByte());
				case 0xC6: Instruction.IfNull(i.readUInt16());
				case 0xC7: Instruction.IfNonNull(i.readUInt16());
				case all: throw 'Unknown Instruction: ${StringTools.hex(all, 2)}';
			}) catch(e:Eof) {}
			catch(d:Dynamic) {
				var last = a.pop();
				while(last != null && last == Instruction.NOp)
					last = a.pop();
				throw '$d after $last';
			}
		return a;
	}
	public function read():Data {
		var d:JClass = untyped {};
		i.bigEndian = true;
		if(i.readInt32() != 0xCAFEBABE)
			throw "Invalid magic number";
		var minorv = i.readUInt16();
		d.version = {minor: minorv, major: i.readUInt16()};
		var constCount = i.readUInt16() - 1;
		d.constants = [for(_ in 0...constCount) readConstant()];
		d.constants.insert(0, null);
		var consts:Array<Constant> = d.constants;
		var accessFlagsi = i.readUInt16();
		d.accessFlags = [];
		if(accessFlagsi & 0x0001 != 0)
			d.accessFlags.push(ClassAccessFlag.Public);
		if(accessFlagsi & 0x0010 != 0)
			d.accessFlags.push(ClassAccessFlag.Final);
		if(accessFlagsi & 0x0020 != 0)
			d.accessFlags.push(ClassAccessFlag.Super);
		if(accessFlagsi & 0x0200 != 0)
			d.accessFlags.push(ClassAccessFlag.Interface);
		if(accessFlagsi & 0x0400 != 0)
			d.accessFlags.push(ClassAccessFlag.Abstract);
		if(accessFlagsi & 0x1000 != 0)
			d.accessFlags.push(ClassAccessFlag.Synthetic);
		if(accessFlagsi & 0x2000 != 0)
			d.accessFlags.push(ClassAccessFlag.Annotation);
		if(accessFlagsi & 0x4000 != 0)
			d.accessFlags.push(ClassAccessFlag.Enum);
		d.thisId = i.readUInt16();
		d.superId = i.readUInt16();
		d.interfaces = [for(_ in 0...i.readUInt16()) i.readUInt16()];
		d.fields = [for(_ in 0...i.readUInt16()) {
			var f:Dynamic = {};
			var flags = i.readUInt16();
			f.accessFlags = [];
			if(flags & 0x0001 != 0) f.accessFlags.push(FieldAccessFlag.Public);
			if(flags & 0x0002 != 0) f.accessFlags.push(FieldAccessFlag.Private);
			if(flags & 0x0004 != 0) f.accessFlags.push(FieldAccessFlag.Protected);
			if(flags & 0x0008 != 0) f.accessFlags.push(FieldAccessFlag.Static);
			if(flags & 0x0010 != 0) f.accessFlags.push(FieldAccessFlag.Final);
			if(flags & 0x0040 != 0) f.accessFlags.push(FieldAccessFlag.Volatile);
			if(flags & 0x0080 != 0) f.accessFlags.push(FieldAccessFlag.Transient);
			if(flags & 0x1000 != 0) f.accessFlags.push(FieldAccessFlag.Synthetic);
			if(flags & 0x4000 != 0) f.accessFlags.push(FieldAccessFlag.Enum);
			f.nameIndex = i.readUInt16();
			f.descriptorIndex = i.readUInt16();
			f.attributes = [for(_ in 0...i.readUInt16()) readAttribute(d.constants)];
			f;
		}];
		var fields:Array<Field> = d.fields;
		d.methods = [for(_ in 0...i.readUInt16()) {
			var m:Dynamic = {};
			var flags = i.readUInt16();
			m.accessFlags = [];
			if(flags & 0x0001 != 0)
				m.accessFlags.push(MethodAccessFlag.Public);
			if(flags & 0x0002 != 0)
				m.accessFlags.push(MethodAccessFlag.Private);
			if(flags & 0x0004 != 0)
				m.accessFlags.push(MethodAccessFlag.Protected);
			if(flags & 0x0008 != 0)
				m.accessFlags.push(MethodAccessFlag.Static);
			if(flags & 0x0010 != 0)
				m.accessFlags.push(MethodAccessFlag.Final);
			if(flags & 0x0020 != 0)
				m.accessFlags.push(MethodAccessFlag.Synchronized);
			if(flags & 0x0040 != 0)
				m.accessFlags.push(MethodAccessFlag.Bridge);
			if(flags & 0x0080 != 0)
				m.accessFlags.push(MethodAccessFlag.VarArgs);
			if(flags & 0x0100 != 0)
				m.accessFlags.push(MethodAccessFlag.Native);
			if(flags & 0x0400 != 0)
				m.accessFlags.push(MethodAccessFlag.Abstract);
			if(flags & 0x0800 != 0)
				m.accessFlags.push(MethodAccessFlag.Strict);
			if(flags & 0x1000 != 0)
				m.accessFlags.push(MethodAccessFlag.Synthetic);
			m.nameIndex = i.readUInt16();
			m.descriptorIndex = i.readUInt16();
			m.attributes = [for(_ in 0...i.readUInt16()) readAttribute(d.constants)];
			m;
		}];
		return cast d;
	}
}