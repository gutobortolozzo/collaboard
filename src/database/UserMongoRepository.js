var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/data');
var Mapper = require("../mapper/mapper.js");
var UserMapper = require("../mapper/UserMapper.js");

LOGIN_COLLECTION = 'logincollection';
SEMANTICS_COLLECTION = 'semanticscollection';

function UserMongoRepository(){
	
	var mapper = new Mapper();
	var userMapper = new UserMapper();
	
	function get(collection){
		return db.get(collection);
	}
	
	this.create = function(user){
		var collection = get(LOGIN_COLLECTION);
		collection.insert(userMapper.toMongoUser(user));
	};
	
	this.deleteElement = function(user){
		var collection = get(LOGIN_COLLECTION);
		collection.remove({'id' : user.id});
	};
	
	this.update = function(user){
		var collection = get(USER_COLLECTION);
		var query = {'_id' : user._id};
		collection.update(query, user);
	};
	
	this.getUser = function(username, callback){
		var collection = get(LOGIN_COLLECTION);
		collection.find({'username' : username}, {}, function(err, docs){
			if(!docs){ 
				callback();
			}else{
				var userSaved = docs[0];
				callback(userSaved);
			}
		});
	};
	
	this.getSemantics = function(callback){
		var collection = get(SEMANTICS_COLLECTION);
		
		collection.find({},{}, function(err, docs){
			
			callback(mapper.toSemantic(docs));
		});
	};
}

module.exports = UserMongoRepository;
