var app = angular.module('app', []);

app.controller('loginCtrl', function($scope, $rootScope, $http, $location) {
  $scope.user = {};

  $scope.validateParams = function(){
	  
	  var user = !$scope.user.username || $scope.user.username.trim().length == 0;
	  
	  var password = !$scope.user.password || $scope.user.password.trim().length == 0;
	  
	  return user || password;
  };
  
  $scope.showIncorrectMessage = function(){
	  $('.login-status').addClass('login-status-visible');
  };
  
  $scope.currentUser = function(){
	return { username : $scope.user.username, password : $scope.user.password};  
  };
  
  $scope.login = function(){
	
	if($scope.validateParams()){
		$scope.showIncorrectMessage();
		return;
	}
	  
    $http.post('/login', $scope.currentUser())
    .success(function(user){
    	var destiny = 'http://'+location.host+"/collaboard/board/?id="+user.hash;
    	window.sessionStorage.token = user.hash;
    	window.location.replace(destiny);
    })
    .error(function(){
    	$location.url('/collaboard');
    	$scope.showIncorrectMessage();
    });
  };
});