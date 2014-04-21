function Mapper() {

	this.toSemantic = function(docs){
		var semantics = {};
		
		docs.forEach(function(data){
			semantics[data.semantic] = data.value;
		});
		return semantics;
	};
}

module.exports = Mapper;
