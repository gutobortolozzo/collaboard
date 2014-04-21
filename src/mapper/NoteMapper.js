function NoteMapper() {

	this.toMongoNote = function(data) {
		return {
			'_id' : data.id,
			'title' : data.title,
			'body' : data.body,
			'x' : data.x,
			'y' : data.y,
			boardID : data.boardID,
			boardUser : data.boardUser,
			zIndex : data.zIndex,
			votes : data.votes,
			solved : data.solved,
			color : data.color, 
			image : data.image
		};
	};

	this.toFrontNote = function(data) {
		return {
			'id' : data._id,
			'title' : data.title,
			'body' : data.body,
			'x' : data.x,
			'y' : data.y,
			boardID : data.boardID,
			boardUser : data.boardUser,
			zIndex : data.zIndex,
			votes : data.votes,
			solved : data.solved,
			color : data.color,
			image : data.image
		};
	};
}

module.exports = NoteMapper;
