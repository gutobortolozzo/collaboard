var Connector = require("../database/UserMongoRepository.js");

function Login(request, response, next){
	
	var connector = new Connector();
	
	var userCallback = function(user){
		
		if(!user) return next(new Error('User not found'));
		
		if(user.username == request.body.username && user.password == request.body.password){
			var user = {hash : user.hash, username : user.username};
			response.send(user);
			return;
		}else{
			next(new Error('User not found'));
		}
	};
	
	this.execute = function(){
		
		connector.getUser(request.body.username, userCallback);
	};
}

module.exports = Login;
