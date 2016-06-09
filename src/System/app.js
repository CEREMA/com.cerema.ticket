App = {
	init: function(app,server) {
		app.use('/tmp',server.static(__dirname + require('path').sep+'tmp'));		
	}
};

module.exports = App;