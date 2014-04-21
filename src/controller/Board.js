var Repo = require("../database/BoardMongoRepository.js");
var Mapper = require("../mapper/BoardMapper.js");

function Board(data){
	
	var repo = new Repo();
	var mapper = new Mapper();
	
	this.create = function(){
		var mongoBoard = mapper.toMongoBoard(data);
		
		repo.create(mongoBoard);
	};
	
	this.update = function(){
		var mongoBoard = mapper.toMongoBoard(data);
		
		repo.update(mongoBoard);
	};
	
	this.deleteElement = function(){
		var mongoBoard = mapper.toMongoBoard(data);
		
		repo.deleteBoard(mongoBoard);
	};
	
	this.getAllUserBoards = function(username, callback){
		
		repo.getAllUserBoards(username, callback);
	};
}

module.exports = Board;
