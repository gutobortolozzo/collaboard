var Repo = require("../database/UserMongoRepository.js");

function User(data){
	
	var repo = new Repo();
	
	this.getSemantics = function(callback){
		repo.getSemantics(callback);
	};
}

module.exports = User;
