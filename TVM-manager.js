var net = require('net');


var settings = {
	tvmPort 			: 701,
	tvmIP				: '192.168.0.8',
//	tvmIP				: '127.0.0.1',		// Emulator
	delayBeforePolling 	: 1000,
	pollingInterval		: 20
	
}

var commands = {
	poll 		: new Buffer([0x01, 0x00, 0x00, 0x00, 0xf4, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),	
	BeeperOn 	: new Buffer([0x14, 0x00, 0x00, 0x00, 0x0, 0x8, 0x00, 0x00]),
	BeeperOff	: new Buffer([0x15, 0x00, 0x00, 0x00, 0x0, 0x8, 0x00, 0x00])
}

var beep = false;

// ####################### TVM Connection #######################
	var tvmClient = new net.Socket();
	tvmClient.on('connect', function(data) {
		console.log('TVM connected.');
		
		
		tvmClient.write(new Buffer([ 0x5, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x15, 0x0, 0x0, 0x0, 0x8, 0x0, 0x0, 0x0]));	
		tvmClient.write(new Buffer([0x14, 0x0, 0x0, 0x0, 0x0, 0x1, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x14, 0x0, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x0b, 0x0, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x15, 0x0, 0x0, 0x0]));
		tvmClient.write(new Buffer([0x48, 0x0, 0x0, 0x0]));		
		
		
		// Start Polling
		setTimeout(
			function(){ 
					setInterval(function(){ poll();},settings.pollingInterval);
					setInterval(function(){
						beep = !beep;
						if(beep){
							tvmClient.write(commands.BeeperOn);
						} else {
							tvmClient.write(commands.BeeperOff);
						}
						
					},500);
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
	
	function processMessage(msg){
		console.log("Processing Message");
		console.log(msg);
	}





// ####################### TVM Exports #######################
module.exports = {
	init: function() {
		tvmClient.connect(settings.tvmPort,settings.tvmIP, function() {
			console.log('TVM connecting.');
		});
	}
};    