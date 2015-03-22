(function() {
	var app = angular.module('angularTT', ['services']);
	app.controller('IndexController', function(DataService, $scope, $window) {
		this.searchInput = '';
		this.service = DataService;
		this.update = function() {
			console.log('update');
			$scope.$apply();
		};
		this.fetch = function() {
			DataService.searchClub(this.searchInput, this.update);
		};
		this.openClubPageInNewWindows = function(alternative){
			$window.open(alternative['href']);
		}
		this.openClub = function(alternative){
			DataService.openClub(alternative['href'], this.update);
		}
		this.loadTtrList = function(){
			DataService.loadTtrList();
		}
	});
})();