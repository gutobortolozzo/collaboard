/**
 * @Author Guto Bortolozzo
 */
var assert = require("assert");
var should = require('should');
var Board = require('../src/controller/Board.js');

describe('Board controller', function() {
	describe('Property', function() {

		var board = {'id' : '5355631bddb223a02c000001', 'user' : 'test', 'name' : 'tester' };
		
		beforeEach(function(done) {
			var newBoard = new Board(board);
			newBoard.create();
			done();
		});
		
		afterEach(function(done) {
			var oldBoard = new Board(board);
			oldBoard.deleteElement();
			done();
		});

		it('should have be an array', function(done) {
			new Board(board).getAllUserBoards('test', function(boards){
				boards.should.have.lengthOf(1);
			});
			
			done();
		});
		
		it('should have property user', function(done) {
			new Board(board).getAllUserBoards('test', function(boards){
				boards[0].should.have.property('user');
			});
			
			done();
		});
		
		it('should have property name', function(done) {
			new Board(board).getAllUserBoards('test', function(boards){
				boards[0].should.have.property('name');
			});
			
			done();
		});
		
		it('should have property id', function(done) {
			new Board(board).getAllUserBoards('test', function(boards){
				boards[0].should.have.property('id');
			});
			
			done();
		});
	});
	
	describe('Operation update', function() {
		
		var board = {'id' : '5355631bddb223a02c000001', 'user' : 'test', 'name' : 'tester' };
		
		beforeEach(function(done) {
			var newBoard = new Board(board);
			newBoard.create();
			board.name = 'value';
			new Board(board).update();
			done();
		});
		
		afterEach(function(done) {
			var oldBoard = new Board(board);
			oldBoard.deleteElement();
			done();
		});
		
		it('should have changed name', function(done) {
			
			new Board(board).getAllUserBoards('test', function(boards){
				boards.should.have.lengthOf(1);
				board.should.containDeep({ name : 'value'});
			});
			
			done();
		});
	});
	
	describe('Operation delete', function() {
		
		var board = {'id' : '5355631bddb223a02c000001', 'user' : 'test', 'name' : 'tester' };
		
		beforeEach(function(done) {
			var newBoard = new Board(board);
			newBoard.create();
			new Board(board).deleteElement();
			done();
		});
		
		afterEach(function(done) {
			var oldBoard = new Board(board);
			oldBoard.deleteElement();
			done();
		});
		
		it('should have changed name', function(done) {
			
			new Board(board).getAllUserBoards('test', function(boards){
				boards.should.have.lengthOf(0);
			});
			
			done();
		});
	});
});
