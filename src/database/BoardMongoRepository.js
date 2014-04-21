var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/data');
var Mapper = require("../mapper/BoardMapper.js");

BOARD_COLLECTION = 'boardscollection';

function BoardMongoRepository(){
	
	var mapper = new Mapper(); 
	
	function get(collection){
		return db.get(collection);
	}
	
	this.create = function(data){
		var collection = get(BOARD_COLLECTION);
		collection.insert(data);
	};
	
	this.update = function(board){
		var collection = get(BOARD_COLLECTION);
		var updateBoard = {'_id' : board._id, 'user' : board.user};
		collection.update(updateBoard, board);
	};
	
	this.getAllUserBoards = function(name, callback){
		var collection = get(BOARD_COLLECTION);
		
		collection.find({'user' : name},{}, function(err, docs){	
			var boards = [];
			
			docs.forEach(function(data){
				boards.push(mapper.toFrontBoard(data));
			});
			
			callback(boards);
		});
	};
	
	this.deleteBoard = function(board){
		var collection = get(BOARD_COLLECTION);
		var deleteBoard = {'_id' : board._id, 'name' : board.name, 'user' : board.user};
		collection.remove(deleteBoard);
	};
}

module.exports = BoardMongoRepository;
