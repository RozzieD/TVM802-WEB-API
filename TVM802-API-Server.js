var express = require('express');

var config = {
	wwwPort : 80
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
	}

	main();	