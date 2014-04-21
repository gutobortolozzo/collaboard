var Repo = require("../database/NoteMongoRepository.js");
var Mapper = require("../mapper/NoteMapper.js");

function Note(data){
	
	var repo = new Repo();
	var mapper = new Mapper();
	
	this.create = function(){
		var mongoNote = mapper.toMongoNote(data);
		
		repo.create(mongoNote);
	};
	
	this.update = function(){
		var mongoNote = mapper.toMongoNote(data);
		
		repo.update(mongoNote);
	};
	
	this.deleteElement = function(){
		var mongoNote = mapper.toMongoNote(data);
		
		repo.deleteElement(mongoNote);
	};
	
	this.getAllFromUser = function(username, callback){
		repo.getAll(username, callback);
	};
}

module.exports = Note;