var express = require('express');
var net = require('net');
var tvmManager = require("./TVM-manager");

var config = {
	wwwPort : 80,
};


var state = {
	"last_reply": "2016/01/01 00:00",
};

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
		var result = tvmManager.processAPIRequest(req.query);
	
		var results = { 'result': result };
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
			
			tvmManager.init();			
	}

	main();	