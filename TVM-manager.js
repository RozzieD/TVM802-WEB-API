var net = require('net');


var settings = {
	tvmPort 			: 701,
//	tvmIP				: '192.168.0.8',
	tvmIP				: '127.0.0.1',		// Emulator
	delayBeforePolling 	: 1000,
	pollingInterval		: 15
	
}

var commands = {
	
}

// ####################### TVM Connection #######################
	var tvmClient = new net.Socket();
	tvmClient.on('connect', function(data) {
		console.log('TVM connected.');
		
		// Start Polling
		setTimeout(
			function(){ 
					setInterval(function(){ poll();},settings.pollingInterval); 
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
		tvmClient.write("ssadfsf");
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