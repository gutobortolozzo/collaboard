/**
 * @Author Guto Bortolozzo
 */
function UserMapper() {

	this.toMongoUser = function(data){
		return {
			'_id' : data.id,
			'username' : data.username, 
			'password' : data.password,
			'hash' : data.hash
		};
	};
	
	this.toFrontUser = function(data){
		return {
			'id' : data._id,
			'username' : data.username, 
			'password' : data.password,
			'hash' : data.hash
		};
	};
}

module.exports = UserMapper;