var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/data');
var Mapper = require("../mapper/NoteMapper.js");

USER_COLLECTION = 'usercollection';

function NoteMongoRepository(){
	
	var mapper = new Mapper(); 
	
	function get(collection){
		return db.get(collection);
	}
	
	this.create = function(data){
		var collection = get(USER_COLLECTION);
		collection.insert(data);
	};

	this.update = function(data){
		var collection = get(USER_COLLECTION);
		var query = {'_id' : data._id};
		collection.update(query, data);
	};

	this.deleteElement = function(data){
		var collection = get(USER_COLLECTION);
		collection.remove({'_id' : data._id});
	};
	
	this.getAll = function(name, callback){
		var collection = get(USER_COLLECTION);
		
		collection.find({boardUser : name},{}, function(err, docs){
			var notes = [];
			
			docs.forEach(function(data){
				notes.push(mapper.toFrontNote(data));
			});
			
			callback(notes);
		});
	};
}

module.exports = NoteMongoRepository;