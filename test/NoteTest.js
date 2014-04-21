/**
 * @Author Guto Bortolozzo
 */
var assert = require("assert");
var should = require('should');
var Note = require('../src/controller/Note.js');

describe('Note controller', function() {
	describe('Property', function() {

		var note = {
			'id' : 123,
			'title' : 'test',
			'body' : 'anything',
			'x' : 400,
			'y' : 500,
			'boardID' : 102030,
			'boardUser' : 2030,
			'zIndex' : 10,
			'votes' : 1,
			'solved' : false,
			'color' : 'green',
			'image' : ''
		};

		beforeEach(function(done) {
			var newNote = new Note(note);
			newNote.create();
			done();
		});

		afterEach(function(done) {
			var oldNote = new Note(note);
			oldNote.deleteElement();
			done();
		});

		it('should be an array with one element', function(done) {
			new Note(note).getAllFromUser(2030, function(notes) {
				notes.should.have.lengthOf(1);
			});

			done();
		});
		
		it('should contain body', function(done) {
			new Note(note).getAllFromUser(2030, function(notes) {
				notes[0].should.have.property('body', 'anything');
			});
			
			done();
		});
		
		it('should contain title', function(done) {
			new Note(note).getAllFromUser(2030, function(notes) {
				notes[0].should.have.property('title', 'test');
			});
			
			done();
		});
		
		it('should not be solved', function(done) {
			new Note(note).getAllFromUser(2030, function(notes) {
				notes[0].should.have.property('solved', false);
			});
			
			done();
		});
			
		it('should be voted', function(done) {
			new Note(note).getAllFromUser(2030, function(notes) {
				notes[0].should.have.property('votes', 1);
			});
			
			done();
		});
	});
	
	describe('Operation update', function() {
		
		var note = {
				'id' : 123,
				'title' : 'test',
				'body' : 'anything',
				'x' : 400,
				'y' : 500,
				'boardID' : 102030,
				'boardUser' : 2030,
				'zIndex' : 10,
				'votes' : 1,
				'solved' : false,
				'color' : 'green',
				'image' : ''
		};
		
		beforeEach(function(done) {
			var newNote = new Note(note);
			newNote.create();
			note.votes = 2;
			newNote.update(note);
			done();
		});
		
		afterEach(function(done) {
			var oldNote = new Note(note);
			oldNote.deleteElement();
			done();
		});
		
		it('should be an array with one element', function(done) {
			new Note(note).getAllFromUser(2030, function(notes) {
				notes.should.have.lengthOf(1);
			});
			
			done();
		});
		
		it('should have two votes', function(done) {
			new Note(note).getAllFromUser(2030, function(notes) {
				notes[0].should.have.property('votes', 2);
			});
			
			done();
		});
	});
	
	describe('Operation delete', function() {
		
		var note = {
				'id' : 123,
				'title' : 'test',
				'body' : 'anything',
				'x' : 400,
				'y' : 500,
				'boardID' : 102030,
				'boardUser' : 2030,
				'zIndex' : 10,
				'votes' : 1,
				'solved' : false,
				'color' : 'green',
				'image' : ''
		};
		
		beforeEach(function(done) {
			var newNote = new Note(note);
			newNote.create();
			note.votes = 2;
			newNote.update(note);
			done();
		});
		
		afterEach(function(done) {
			var oldNote = new Note(note);
			oldNote.deleteElement();
			
			new Note(note).getAllFromUser(2030, function(notes) {
				notes.should.have.lengthOf(0);
			});
			
			done();
		});
		
		it('should have one note in the middle', function(done) {
			new Note(note).getAllFromUser(2030, function(notes) {
				notes.should.have.lengthOf(1);
			});
			
			done();
		});
	});
});