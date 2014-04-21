var app = angular.module('app', []);

SEMANTICS_DICTIONARY = [];

function setColor(element, color){
	element.animate({
		'background-color' : color
	});
	element.find('.simpleColorDisplay').css('background-color', color);
}

function setZIndex(element, note){
	element.zIndex(note.zIndex);
}

function setImage(element, note){
	if(!note.image || note.image.length <= 0) return;
	var atual = element.find('.details').find('.image-attached');
	atual.remove();
	var image = document.createElement('img');
	image.src = note.image;
	image.className = 'image-attached';
	element.find('.details').append(image);
	
	$(element.find('.details')[0]).css('height', image.height+"px");
	$(element.find('.details')[0]).css('width', image.width+"px");
}

function colors(){
	return ['#fcf8e3', '#ffc300', '#7ec3ff', '#FFA54F', '#eeeeee', '#cccccc', '#B0E0E6', '#BDFCC9', '#FFEC8B', '#FF6347',
	        '#EEE9E9', '#71C671', '#B7B7B7', '#FFC0CB', '#CAE1FF', '#FFA500'];
}

function gup(name){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
	var regexS = "[\\?&]"+name+"=([^&#]*)";  
	var regex = new RegExp( regexS );  
	var results = regex.exec(window.location.href); 
	if( results == null )
		return "";  
	else    
		return results[1];
}

app.directive('stickyNote', function(socket, $parse) {
	var linker = function(scope, element, attrs) {
			element.draggable({
				stack: ".sticky-note",
				stop: function(event, ui) {
					scope.note.x = ui.position.left;
					scope.note.y = ui.position.top;
					scope.note.zIndex = element.zIndex();
					socket.emit('moveNote', scope.note);
				}
			});
			
			var onImageDrop = $parse(attrs.onImageDrop);

            var onDragOver = function (e) {
                e.preventDefault();
                $('body').addClass("dragOver");
            };

            var onDragEnd = function (e) {
                e.preventDefault();
                $('body').removeClass("dragOver");
            };

            var loadFile = function (file) {
                scope.uploadedFile = file;
                scope.$apply(onImageDrop(scope));
                scope.uploadedFile = file;
            	
            	var reader = new FileReader();
            	ret = [];
            	
				reader.onload = function(e) {
					scope.note.image = e.target.result;
					setImage(element, scope.note);
					socket.emit('imageAttached', scope.note);
				};
            	
            	reader.onerror = function(stuff) {
            	  console.log("error", stuff);
            	  console.log (stuff.getMessage());
            	};
            	
            	reader.readAsDataURL(file);
            	
            	scope.$apply(onImageDrop(scope));
            };

            $(document).bind("dragover", onDragOver);

            element.bind("dragleave", onDragEnd).bind("drop", function (e) {
               onDragEnd(e);
               var file = e.originalEvent.dataTransfer.files[0];
               
               if(file.type.indexOf('image') < 0 || file.size > 51200){
            	   return alert('Conteudo anexado muito grande');
               }
               
               loadFile(file);
            });
			
			element.find('.color-box').simpleColor({
				colors: colors(),
				boxHeight: 15,
				boxWidth: 15,
				onSelect: function (colorHex){
					scope.note.color = colorHex;
					setColor(element, colorHex);
					socket.emit('colorChange', scope.note);
				}
			});
			
			element.dblclick(function(){
				var details = element.find('.details');
				if(details.hasClass('details-visible')){
					details.removeClass('details-visible');
					details.fadeOut('slow');
				}else{
					details.addClass('details-visible');
					details.fadeIn('slow');
				}
			});
			
			element.ready(function(){
				element.animate({
					left: scope.note.x,
					top: scope.note.y
				});
				setColor(element, scope.note.color);
				setZIndex(element, scope.note);
				setImage(element, scope.note);
			});
			
			socket.on('onColorChange', function(data) {
				if(data.id === scope.note.id){
					scope.note.color = data.color;
					setColor(element, data.color);
				}
				scope.updateColorOfNotVisible(data);
			});
			
			socket.on('onNoteMoved', function(data) {
				if(data.id === scope.note.id) {
					element.animate({left: data.x, top: data.y}, 300);
					scope.note.x = data.x;
					scope.note.y = data.y;
					scope.note.zIndex = data.zIndex;
					setZIndex(element, scope.note);
				}
				
				scope.updatePositionOfNotVisible(data);
			});
			
			socket.on('onImageAttached', function(note){
				if(note.id === scope.note.id) {
					scope.note.image = note.image;
					setImage(element, scope.note);
				}
			});
			
			element.hide().fadeIn();
		};

	var controller = function($scope) {
			socket.on('onNoteUpdated', function(data) {
				if(data.id === $scope.note.id) {
					$scope.note.title = data.title;
					$scope.note.body = data.body;
				}				
			});
			
			$scope.updateColorOfNotVisible = function(data){
				$scope.$parent.notes.forEach(function(note){
					if(data.id === note.id){
						note.color = data.color;
					}
				});
			};
			
			$scope.updatePositionOfNotVisible = function(data){
				$scope.$parent.notes.forEach(function(note){
					if(data.id === note.id){
						note.x = data.x;
						note.y = data.y;
						note.zIndex = data.zIndex;
					}
				});
			};
			
			$scope.updateNote = function(note) {
				socket.emit('updateNote', note);
			};

			$scope.deleteNote = function(id) {
				$scope.ondelete({id: id});
			};
			
			$scope.voteUp = function(note){
				note.votes++;
				socket.emit('votedNote', note);
			};
			
			$scope.voteDown = function(note){
				note.votes--;
				socket.emit('votedNote', note);
			};
		};

	return {
		restrict: 'A',
		link: linker,
		controller: controller,
		scope: {
			note: '=',
			ondelete: '&'
		}
	};
});

app.filter("filterByAttributes", function(){
	
	return function(notes, lookingFor){
		
		if(!lookingFor) return notes;
		
		var filterWord = lookingFor.toLowerCase();
		
		var filtered = [];
		
		angular.forEach(notes, function(note){
			if(containsOnNote(note, filterWord) || mapSemantics(filterWord, note))
				filtered.push(note);
		});
		
		return filtered;
	};
});

function containsOnNote(note, lookingFor){
	return containsOnTitleOrBody(note, lookingFor) || creationDate(note, lookingFor) || lookingFor == note.votes;
}

function creationDate(note, lookingFor){
	var criacao = new Date(note.id);
	return criacao.toLocaleDateString().indexOf(lookingFor) !== -1;
}

function containsOnTitleOrBody(note, lookingFor){
	return note.title.toLowerCase().indexOf(lookingFor) !== -1 || note.body.toLowerCase().indexOf(lookingFor) !== -1; 
}

function mapSemantics(word, note){
	
	if(!SEMANTICS_DICTIONARY[word]) return false;
	
	return SEMANTICS_DICTIONARY[word].indexOf(note.color) !== -1;
};

app.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

app.controller('MainCtrl', function($scope, $location, socket, shared, $filter) {
	$scope.notes = [];
	
	$scope.$watch('notes', function () {
		shared.element.notes = $scope.notes;
	});
	
	socket.emit('startClientInformation', gup('id'));
	
	socket.on('createdNotes', function(data){
		data.forEach(function(object){ 
			$scope.notes.push(object);
		});
	});
	
	socket.on('onNoteCreated', function(data) {
		$scope.notes.push(data);
	});

	socket.on('onNoteDeleted', function(data) {
		$scope.handleDeletedNoted(data.id);
	});
	
	socket.on('onVotedNote', function(data) {
		$scope.notes.forEach(function(note){
			if(data.id === note.id){
				note.votes = data.votes;
			}
		});
	});
	
	socket.on('onNoteSolved', function(data){
		var notes = [];
		$scope.notes.forEach(function(note){
			if(data.id !== note.id)
				notes.push(note);
		});
		$scope.notes = notes;
	});
	
	socket.on('semantics', function(semantics){
		SEMANTICS_DICTIONARY = semantics; 
	});
	
	$scope.createNote = function() {
		
		if(!shared.element.selectedBoard)
			return alert("SELECT BOARD FIRST");
		
		if(validateGup()){
			return alert("Dont change your id");
		}
		
		var boardID = shared.element.selectedBoard.id;
		var boardUser = shared.element.selectedBoard.user;
		
		var note = {
			id : new Date().getTime() + gup('id'),
			title : 'Note',
			body : 'content',
			boardID : boardID,
			boardUser : boardUser,
			x : 648,
			y : 289,
			zIndex : 0,
			votes : 1,
			solved : false,
			color : '#fcf8e3',
			image : ''
		};
		
		$scope.notes.push(note);
		socket.emit('createNote', note);
	};
	
	$scope.$on('deleteRelatedNotes', function(event, board){
		var notes = [];
		angular.forEach($scope.notes, function(note){
			if(note.boardID === board.id){
				$scope.deleteNote(note.id);
			}else{
				notes.push(note);
			}
		});
		$scope.notes = notes;
	});
	
	$scope.boardsFilter = function(note){
		if(!shared.element.selectedBoard) return false;
		return shared.element.selectedBoard.id === note.boardID;
	};
	
	$scope.deleteNote = function(id) {
		$scope.handleDeletedNoted(id);
		socket.emit('deleteNote', {id: id});
	};
	
	$scope.handleDeletedNoted = function(id) {
		var oldNotes = $scope.notes, newNotes = [];

		angular.forEach(oldNotes, function(note) {
			if(note.id !== id){ newNotes.push(note);} 
		});

		$scope.notes = newNotes;
	};
});