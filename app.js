var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	var cluster = require('cluster');
	var cpus = require('os').cpus().length;
	var RedisStore = require('socket.io/lib/stores/redis');
	var redis = require('socket.io/node_modules/redis');
	var Login = require(__dirname + "/src/controller/Login.js");
	var Note = require(__dirname + "/src/controller/Note.js");
	var Board = require(__dirname + "/src/controller/Board.js");
	var User = require(__dirname + "/src/controller/User.js");

REDIS_PORT = 6379;
REDIS_IP = '127.0.0.1';
	
if(cluster.isMaster) {
	
	for(var i = 0; i < 10; i++) cluster.fork();

	io.set('store', new RedisStore({
		redisPub: redis.createClient(REDIS_PORT, REDIS_IP),
		redisSub: redis.createClient(REDIS_PORT, REDIS_IP),
		redisClient: redis.createClient(REDIS_PORT, REDIS_IP)
	}));
}
if(cluster.isWorker){
		
		app.use(express.json()); 
		
		app.configure(function() {
			app.use('/chart', express.static(__dirname + '/chart'));
		    app.use('/collaboard/board/', express.static(__dirname + '/public'));
		    app.use('/', express.static(__dirname + '/login'));
		    app.use('/home', express.static(__dirname + '/public'));

			app.post('/login', function(req, res, next) {
				new Login(req, res, next).execute();
			});
		});
		
		io.set('store', new RedisStore({
		    redisPub: redis.createClient(REDIS_PORT, REDIS_IP),
		    redisSub: redis.createClient(REDIS_PORT, REDIS_IP),
		    redisClient: redis.createClient(REDIS_PORT, REDIS_IP)
		}));
		
		cluster.on('exit', function(worker, code, signal) {
			console.log('worker ' + worker.process.pid + ' died');
		});
		
		cluster.on('listening', function(worker, address) {
			console.log("A worker is now connected to " + address.address + ":" + address.port);
		});
		
		io.sockets.on('connection', function(socket) {
			
			socket.on('startClientInformation', function(user){
				
				socket.join(user);
				
				new User().getSemantics(function(semantic){
					socket.to(user).emit('semantics', semantic);
				});
				
				new Note().getAllFromUser(user, function(notes){
					socket.to(user).emit('createdNotes', notes);
				});
			});
			
			socket.on('createNote', function(data) {
				socket.broadcast.to(data.boardUser).emit('onNoteCreated', data);
				new Note(data).create();
			});
	
			socket.on('updateNote', function(data) {
				socket.broadcast.to(data.boardUser).emit('onNoteUpdated', data);
				new Note(data).update();
			});
	
			socket.on('moveNote', function(data){
				socket.broadcast.to(data.boardUser).emit('onNoteMoved', data);
				new Note(data).update();
			});
	
			socket.on('deleteNote', function(data){
				socket.broadcast.to(data.boardUser).emit('onNoteDeleted', data);
				new Note(data).deleteElement();
			});
			
			socket.on('colorChange', function(data){
				socket.broadcast.to(data.boardUser).emit('onColorChange', data);
				new Note(data).update();
			});
			
			socket.on('votedNote', function(data){
				socket.broadcast.to(data.boardUser).emit('onVotedNote', data);
				new Note(data).update();
			});
			
			socket.on('imageAttached', function(note){
				socket.broadcast.to(note.boardUser).emit('onImageAttached', note);
				new Note(note).update();
			});
			
			socket.on('createBoard', function(board){
				socket.broadcast.to(board.board).emit('onCreateBoard', board);
				new Board(board).create();
			});
			
			socket.on('userBoards', function(name){
				new Board().getAllUserBoards(name, function(boards){
					socket.to(name).emit('createdUserBoards', boards);
				});
			});
			
			socket.on('deleteBoard', function(board){
				socket.broadcast.to(board.board).emit('onDeletedBoard', board);
				new Board(board).deleteElement();
			});
			
			socket.on('updateBoard', function(board){
				socket.broadcast.to(board.board).emit('onUpdateBoard', board);
				new Board(board).update();
			});
	});

	server.listen(8080);
}