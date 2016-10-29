var net = require('net');


var settings = {
	tvmPort 			: 701,
	tvmIP				: '192.168.0.8',
	//tvmIP				: '127.0.0.1',		// Emulator
	delayBeforePolling 	: 1000,
	pollingInterval		: 20,
	enablePolling		: false
	
}


var state = {
	"last_reply": "2016/01/01 00:00",
	VacuumPump 	: 0,
	Vacuum1 	: 0,
	Vacuum2 	: 0,
	Blowing1 	: 0,
	Blowing2 	: 0,
	Pressure1	: 0,
	Pressure2	: 0,
	Buzzer		: 0,
	Prick		: 0,
	Leds		: 0,
	Position	: {
		X 		: 0,
		Y 		: 0,
		A1 		: 0,
		A2 		: 0,
		Nozzle 	: 0
	},
	SpeedMode	: "Slow"	
};

var commands = {
	poll 		: new Buffer([0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),	
	reqState	: new Buffer([0x00, 0x00, 0x00, 0x00]),
	
	BuzzerOn 	: new Buffer([0x14, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00]),
	BuzzerOff	: new Buffer([0x15, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00]),
	
	PrickOn 	: new Buffer([0x14, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00]),
	PrickOff 	: new Buffer([0x15, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00]),

	PumpOn		: new Buffer([0x14, 0x00, 0x00, 0x00, 0x08, 0x04, 0x00, 0x00]),
	PumpOff		: new Buffer([0x15, 0x00, 0x00, 0x00, 0x08, 0x04, 0x00, 0x00]),
	
	Blowing1On	: new Buffer([0x14, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00]),
	Blowing1Off	: new Buffer([0x15, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00]),
	
	Blowing2On	: new Buffer([0x14, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00]),
	Blowing2Off	: new Buffer([0x15, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00]),
	
	Vacuum1On	: new Buffer([0x14, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]),
	Vacuum1Off	: new Buffer([0x15, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]),

	Vacuum2On	: new Buffer([0x14, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00]),
	Vacuum2Off	: new Buffer([0x15, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00]),
	
	LedsOn		: new Buffer([0x14, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00]),
	LedsOff		: new Buffer([0x15, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00])
	
	
	
	
	
	
	/*
	HighSpeed	, 0x new Buffer([0x14, 0x00, 0x00, 0x00, 0x80, 0x00, 0x00, 0x00, 
	0x15, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]),
	LowSpeed	, 0x new Buffer([0x15, 0x00, 0x00, 0x00, 0x80, 0x00, 0x00, 0x00, 0x14, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]),
	*/

	/*	
	
	
	
	Strip 08, 0x00, 0x01, 0x00, 0x80, 0x7b, 0xe1, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	
	XMinus 06, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xe8, 0x03, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00
	08, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0xf8, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	09, 0x00, 0x04, 0x00
	
	XPlus 06, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xe8, 0x03, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00
	08, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0xfc, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	09, 0x00, 0x04, 0x00
	
	YMinus
	06, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xe8, 0x03, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00
	08, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	09, 0x00, 0x10, 0x00
	
	YPlus
	06, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xe8, 0x03, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00
	08, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe8, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	09, 0x00, 0x10, 0x00
	*/
	
	
}

var beep = false;

// ####################### TVM Connection #######################
	var tvmClient = new net.Socket();
	tvmClient.on('connect', function(data) {
		console.log('TVM connected.');
		
		
		tvmClient.write(new Buffer([0x5, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x15, 0x0, 0x0, 0x0, 0x8, 0x0, 0x0, 0x0]));	
		tvmClient.write(new Buffer([0x14, 0x0, 0x0, 0x0, 0x0, 0x1, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x14, 0x0, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x0b, 0x0, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x15, 0x0, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x48, 0x0, 0x0, 0x0]));		
		
		
		// Start Polling
		setTimeout(
			function(){ 
				
					if(settings.enablePolling){
						setInterval(function(){ poll();},settings.pollingInterval);
					}
					
					
					setInterval(function(){ getState();},settings.pollingInterval*10);
					
					/*
					setInterval(function(){
						beep = !beep;
						if(beep){
							tvmClient.write(commands.PrickOn);
						} else {						
							tvmClient.write(commands.PrickOff);
						}
						
					},1000);
					*/
			}, 
			settings.delayBeforePolling
		);		

		
	});

	tvmClient.on('close', function() {
		console.log('TVM connection closed.');
	});

	tvmClient.on('error', function (err) {
		console.log("TVM Connection - " + err );
	});

	tvmClient.on('data', function(data) {
		processMessage(data);
	});

// ####################### TVM Main functions #######################
	function poll(){
		console.log("Sending Poll.");	
		tvmClient.write(commands.poll);
	}
	
	function getState(){
		console.log("Getting State.");	
		tvmClient.write(commands.reqState);		
	}
	
	function processMessage(msg){
		console.log("  <<<<< P&P Msg <<<<<");
		switch(msg[0]) {
			case 0x00:
				console.log("Machine State");
				updateState(msg);
				break;
			case 0x01:
				console.log("Heart Beat");
				break;
			default:
				console.log("Message nor processed");
		}
	}
	
	function updateState(msg){
		if(msg.length !== 44){
			console.log("Invalid message");
			return;
		}
		
		if((msg[4] & 8) === 8){ state.VacuumPump = 1; } else { state.VacuumPump = 0; };
		if((msg[4] & 4) === 4){ state.Vacuum1 = 1; } else { state.Vacuum1 = 0; };
		if((msg[5] & 32) === 32){ state.Vacuum2 = 1; } else { state.Vacuum2 = 0; };

		if((msg[4] & 2) === 2){ state.Blowing1 = 1; } else { state.Blowing1 = 0; };
		if((msg[5] & 16) === 16){ state.Blowing2 = 1; } else { state.Blowing2 = 0; };
		
		if((msg[5] & 8) === 8){ state.Buzzer = 1; } else { state.Buzzer = 0; };
		if((msg[5] & 64) === 64){ state.Prick = 1; } else { state.Prick = 0; };
		
		if((msg[8] & 4) === 4){ state.LimitTop = 1; } else { state.LimitTop = 0; };
		if((msg[8] & 8) === 8){ state.LimitBottom = 1; } else { state.LimitBottom = 0; };
		if((msg[8] & 2) === 2){ state.LimitLeft = 1; } else { state.LimitLeft = 0; };
		if((msg[8] & 1) === 1){ state.LimitRight = 1; } else { state.LimitRight = 0; };
		
		if((msg[5] & 2) === 2){ state.Leds = 1; } else { state.Leds = 0; };
		
		if((msg[8] & 16) === 16) { state.Pressure1 = 0; } else { state.Pressure1 = 1; };
		if((msg[10] & 16) === 16){ state.Pressure2 = 0; } else { state.Pressure2 = 1; };
		
		var msgStr = msg.toString('hex');
		
		state.Position.X 		= convertPositionToMM(msgStr.substring(40, 48),32808);
		state.Position.Y 		= convertPositionToMM(msgStr.substring(56, 64),32808);
		state.Position.A1 		= convertPositionToMM(msgStr.substring(48, 56),4444.44);
		state.Position.A2 		= convertPositionToMM(msgStr.substring(64, 72),4444.44);
		state.Position.Nozzle 	= convertPositionToMM(msgStr.substring(32, 40),32808);
		
		
		
		if((msg[5] & 1) === 1 && (msg[4] & 128) !== 128) {state.SpeedMode = "Slow";};
		// Slow bit is not always setting
		if((msg[5] & 1) !== 1 && (msg[4] & 128) === 128) {state.SpeedMode = "Fast";}
		
		
		
		// No pressure on 2
		//<Buffer 00 00 00 00 88 27 00 00 f5 ff ff 03 00 00 00 00 00 00 00 00 c0 73 a3 00 00 00 00 00 e0 f6 af 00 00 00 00 00 00 00 00 00 00 00 00 00>
		//<Buffer 00 00 00 00 88 27 00 00 f5 ff ef 03 00 00 00 00 00 00 00 00 c0 73 a3 00 00 00 00 00 e0 f6 af 00 00 00 00 00 00 00 00 00 00 00 00 00>
		
		
		// No pressure no pump vacuum 1 on
		//                    vac1 
		//<Buffer 00 00 00 00 84 02 00 00 f5 ff ff 03 00 00 00 00 00 00 00 00 c0 73 a3 00 00 00 00 00 e0 f6 af 00 00 00 00 00 00 00 00 00 00 00 00 00>
		
		// Pressure ,pump , vacuum 1 on
		//					  vac1+pump
		//<Buffer 00 00 00 00 8c 07 00 00 e5 ff ff 03 00 00 00 00 00 00 00 00 c0 73 a3 00 00 00 00 00 e0 f6 af 00 00 00 00 00 00 00 00 00 00 00 00 00>
		
		//														Nozzle			X			A1			  y				A2
		//00 00 00 00  00 03 00 00  f5 ff ff 03  00 00 00 00  00 00 00 00  c0 73 a3 00  30 63 03 00  e0 f6 af 00  98 b1 01 00  00 00 00 00  00 00 00 00>
		//00:00:00:00: 40:03:00:00: f1:ff:ff:03: 00:00:00:00: 00:00:00:00: c0:73:a3:00: 00:00:00:00: 00:00:00:00: 00:00:00:00: 00:00:00:00: 00:00:00:00
		//00:00:00:00: 40:03:00:00: f1:ff:ff:03: 00:00:00:00: 00:00:00:00: c0:73:a3:00: 00:00:00:00: 40:01:05:00: 00:00:00:00: 00:00:00:00: 00:00:00:00
		
		/*
		hex 40:01:05:00
		int 4194565 / 32808.00
		
		*/
		
		
		//state.Vacuum1 = 1;
		console.log(msg);
		console.log(state);
		
		// <Buffer 00 00 00 00 a0 01 00 00 f1 ff ff 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
		// <Buffer 00 00 00 00 a0 03 00 00 f1 ff ff 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>

		
		
		/*

		vac1 = CheckBit(RecvBuffer, 62);
		vac2 = CheckBit(RecvBuffer, 51);
		blow1 = CheckBit(RecvBuffer, 63);
		blow2 = CheckBit(RecvBuffer, 52);
		pres1 = CheckBit(RecvBuffer, 92);
		pres2 = CheckBit(RecvBuffer, 76);
		strip = CheckBit(RecvBuffer, 319);
		*/
		
		
	}
	
	function convertNozzlePositionToMM(value){
		/*
		//getting nozzle position
			int nozzle = BuildNumber(RecvBuffer + 16, 4);
			
			
			double slope = 1;
			int step = 78000;
			double offset = 0;
			int nozzle_abs = abs(nozzle);
			//linear interpolation of nozzle position
			if (nozzle_abs >= 0 && nozzle_abs <= 78000) {
				slope = (5.13 - 0) / step;
				offset = 0;
			}
			else if (nozzle_abs > 78000 && nozzle_abs <= 156000) {
				slope = (9.78 - 5.13) / step;
				offset = 0.48;
			}
			else if (nozzle_abs > 156000 && nozzle_abs <= 234000) {
				slope = (13.51 - 9.78) / step;
				offset = 2.32;
			}
			else {
				slope = (15.99 - 13.51) / step;
				offset = 6.07;
			}
			
			
			if (nozzle < 0)
				offset = -offset;
			N_pos = nozzle * slope + offset;
			N_pos = round(N_pos * 100) / 100;

		*/
		var result 	= 0;
		var nozzle 	= parseInt((value.substring(6,8) + value.substring(4,6) + value.substring(2,4) + value.substring(0,2)),16);
		var slope	= 1.00;
		var step = 78000;
		var offset 	= 0.00;
		
		//linear interpolation of nozzle position
		if (nozzle >= 0 && nozzle <= 78000) {
			slope = (5.13 - 0) / step;
			offset = 0;
		}
		else if (nozzle > 78000 && nozzle <= 156000) {
			slope = (9.78 - 5.13) / step;
			offset = 0.48;
		}
		else if (nozzle > 156000 && nozzle <= 234000) {
			slope = (13.51 - 9.78) / step;
			offset = 2.32;
		}
		else {
			slope = (15.99 - 13.51) / step;
			offset = 6.07;
		}
		
		if (nozzle < 0){
			offset = -offset;
		}
		
		result = nozzle * slope + offset;
		result = Math.round(result * 100) / 100;
		
		return result;
	}
	
	function convertPositionToMM(value,stepPerMM){		
		var reversed = value.substring(6,8) + value.substring(4,6) + value.substring(2,4) + value.substring(0,2);
		
		//var str = '0xA373C0';
		//return parseFloat(0xA373C0,16); // working
		return parseInt(reversed,16) / stepPerMM;
	}
	
	function getBit(msg,index){
		var byteIndex = Math.floor(index/8);
		var bitIndex = index % 8;
		var targetByte = msg[byteIndex];
		return targetByte;		
	}

	function processAPIRequest(query){		
		var keys = Object.keys(query);
		if(keys.length > 1 || keys.length === 0){
			return -1;
		}
		
		switch (keys[0]){
				case 'buzzer':
					if(query[keys[0]] === '1'){ tvmClient.write(commands.BuzzerOn); } else { tvmClient.write(commands.BuzzerOff); }
					return 1;
				case "prick":
					if(query[keys[0]] === '1'){ tvmClient.write(commands.PrickOn); } else { tvmClient.write(commands.PrickOff); }
					return 1;
				case "pump":
					if(query[keys[0]] === '1'){ tvmClient.write(commands.PumpOn); } else { tvmClient.write(commands.PumpOff); }
					return 1;
				case "blowing1":
					if(query[keys[0]] === '1'){ tvmClient.write(commands.Blowing1On); } else { tvmClient.write(commands.Blowing1Off); }
					return 1;
				case "blowing2":
					if(query[keys[0]] === '1'){ tvmClient.write(commands.Blowing2On); } else { tvmClient.write(commands.Blowing2Off); }
					return 1;
				case "vacuum1":
					if(query[keys[0]] === '1'){ tvmClient.write(commands.Vacuum1On); } else { tvmClient.write(commands.Vacuum1Off); }
					return 1;
				case "vacuum2":
					if(query[keys[0]] === '1'){ tvmClient.write(commands.Vacuum2On); } else { tvmClient.write(commands.Vacuum2Off); }
					return 1;
				case "leds":
					if(query[keys[0]] === '1'){ tvmClient.write(commands.LedsOn); } else { tvmClient.write(commands.LedsOff); }
					return 1;
				default :
					return -1;
		}
		return -1;
	}





// ####################### TVM Exports #######################
module.exports = {
	init : function() {
		tvmClient.connect(settings.tvmPort,settings.tvmIP, function() {
			console.log('TVM connecting.');
		});
	},
	processAPIRequest : processAPIRequest,
	state : state
};    