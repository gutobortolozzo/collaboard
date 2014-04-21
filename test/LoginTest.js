/**
 * @Author Guto Bortolozzo
 */
var assert = require("assert");
var should = require('should');
var Repository = require('../src/database/UserMongoRepository.js');
var Login = require('../src/controller/Login.js');

describe('Note controller', function() {
	describe('Property', function() {

		var user = { "id" : '5355737a31c3a0b72d000001', "username" : "test", "password" : "12345", "hash" : "4567891234" };

		beforeEach(function(done) {
			new Repository().create(user);
			done();
		});

		afterEach(function(done) {
			new Repository().deleteElement(user);
			done();
		});

		it('should have one user to login', function(done) {
			
			var request = { body : { 'username' : 'test', 'password' : '12345'}};
			
			new Login(request, new Response()).execute();
			
			done();
		});
		
		function Response(){
			this.send = function(user){
				user.should.have.property('hash', '4567891234');
			};
		};
	});
});