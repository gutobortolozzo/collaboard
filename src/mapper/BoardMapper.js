function MongoMapper() {

	this.toMongoBoard = function(data){
		return {
			'_id' : data.id,
			'user' : data.user, 
			'name' : data.name,
		};
	};
	
	this.toFrontBoard = function(data){
		return {
			'id' : data._id,
			'user' : data.user, 
			'name' : data.name,
		};
	};
}

module.exports = MongoMapper;