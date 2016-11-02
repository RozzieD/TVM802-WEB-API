//a8113700  // 110
//68103200  // 100


	function BuildNumber(value){
		return value.substring(6,8) + value.substring(4,6) + value.substring(2,4) + value.substring(0,2);		
	}
	
	
	console.log(parseInt(BuildNumber('68103200'),16)/32808);
	console.log(parseInt(BuildNumber('a8164b00'),16)/32808);
		
		
		
	function PositionToReversedHEX(position,stepsPerMM){
		var roundedLocation = Math.round(position*100)/100;
		var steps = Math.round(roundedLocation * stepsPerMM);
		var pad = "00000000"
		var stepsHex = steps.toString(16);
		var stepsHexPad = pad.substring(0,pad.length - stepsHex.length) + stepsHex;
	

	
		return BuildNumber(stepsHexPad);
	}	
	
	
	
	
	
	console.log(PositionToReversedHEX(110,32808));
	
	console.log(Buffer.from(PositionToReversedHEX(110,32808), 'hex'));