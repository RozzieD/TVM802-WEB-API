var express = require('express');
var net = require('net');
var tvmManager = require("./TVM-manager");

var config = {
	wwwPort : 80,
	tvmPort : 701,
	tvmIP	: '192.168.0.8'
};


var state = {
	"last_reply": "2016/01/01 00:00",
};




// TVM802 Connection
	var tvmClient = new net.Socket();
	tvmClient.on('connect', function(data) {
		console.log('TVM connected.');
	});
	
	tvmClient.on('close', function() {
		console.log('TVM connection closed.');
		tvmManager.init();
	});

	tvmClient.on('error', function (err) {
		console.log("TVM Connection - " + err );
	});

	tvmClient.on('data', function(data) {
		console.log('Received: ' + data);
	});

// ####################### Web Server #######################
	var server = express();
	
	

	server.get('/api/status', function (req, res) {
		res.json(state);
	});
	// redirect home for now
	server.get('/', function (req, res) {
		res.redirect('/api/status');
	});
	
	server.get('/api/set', function (req, res) {
		if (req.query.buzzer) {
			console.log("Buzzer:"+req.query.buzzer);
		}

		var results = { 'result': 'OK' };
		res.json(results);
	});
	
	server.get('/api/home', function (req, res) {
		var results = { 'result': 'OK' };
		res.json(results);
	});

// ####################### Main #######################
	function main(){
			server.listen(config.wwwPort, function () {
				require('dns').lookup(require('os').hostname(), function (err, add, fam) {
					console.log('HTTP Server listening on '+ add +':'+config.wwwPort);
				})
			});
			
			tvmClient.connect(config.tvmPort,config.tvmIP, function() {
				console.log('Connected');
			});
	}

	main();	