var settings = {
	delayBeforePolling 	: 1000,
	pollingInterval		: 15
	
}


function poll(){
	console.log("Sending Poll.");	
}


module.exports = {
	init: function() {
		console.log("TVM Init.");
		
		// Start Polling
		setTimeout(
			function(){ 
					setInterval(function(){ poll();},settings.pollingInterval); 
			}, 
			settings.delayBeforePolling
		);		
	}
};
       