function validateGup(){
	return window.sessionStorage.token != gup('id');
}
var EFFECTS_SPEED = 'fast';
app.directive('boardsContainer', function(socket){
	var linker = function(scope, element, attrs) {
		element.find('.brand').click(function(){
			var boards = element.find('.boards');
			
			if(boards.css('display') === 'none'){
				boards.fadeIn(EFFECTS_SPEED);
				boards.addClass('boards-visible');
			}else{
				boards.fadeOut(EFFECTS_SPEED);
				boards.removeClass('boards-visible');
			}
		});
	};

	var controller = function($scope, $element) {};

	return {
		restrict: 'A',
		link: linker,
		controller: controller,
		scope: {
			note: '=',
		}
	};
});

app.factory('shared', function($rootScope) {
	
	var elements = { notes : [], boards : [], selectedBoard : null };
	
	return { element : elements};
});

app.controller('boardsCtrl', function($scope, socket, shared){
	$scope.boards = [];
	$scope.selected;
	$scope.selectedElement;

	$scope.$watch('boards', function () {
		shared.element.boards = $scope.boards; 
	});
	
	if(!window.sessionStorage.token){
		window.sessionStorage.token = gup('id');
	}
	
	socket.emit('userBoards', gup('id'));
	
	socket.on('createdUserBoards', function(boards){
		$scope.boards = boards;
	});
	
	$scope.createBoard = function(){
		
		if(validateGup())
			return alert("Dont change your id");
		
		var user = gup('id');
		var board = {
			id : new Date().getTime() + user,
			user : user,
			name : 'Name',
		};
		
		socket.emit('createBoard', board);
		$scope.boards.push(board);
	};
	
	socket.on('onCreateBoard', function(board){ 
		$scope.boards.push(board);
	});
	
	socket.on('onDeletedBoard', function(board){
		$scope.handleDeleteBoard(board);
	});
	
	socket.on('onUpdateBoard', function(board){
		angular.forEach($scope.boards, function(element){
			if(element.id === board.id)
				element.name = board.name;
		});
	});
	
	$scope.handleDeleteBoard = function(board){
		var oldBoards = $scope.boards, newBoards = [];
		
		angular.forEach(oldBoards, function(each) {
			if(each.id !== board.id){ 
				newBoards.push(each); 
			} 
		});
		
		$scope.$emit('deleteRelatedNotes', board);
		$scope.boards = newBoards;
	};
	
	$scope.deleteBoard = function(board){
		$scope.handleDeleteBoard(board);
		socket.emit('deleteBoard', board);
	};
	
	$scope.select = function(board, event){
		if($scope.selectedElement)
			angular.element($scope.selectedElement).removeClass('board-selected');
		
		$scope.selectedElement = event.target;
		shared.element.selectedBoard = board;
		angular.element($scope.selectedElement).addClass('board-selected');
		var containerBoards = angular.element(event.target.parentElement.parentElement.parentElement);
		containerBoards.fadeOut(EFFECTS_SPEED);
		containerBoards.removeClass('boards-visible');
	};
	
	$scope.updateBoard = function(board){
		socket.emit('updateBoard', board);
	};
});