(function() {
	var app = angular.module('angularTT', ['services']);
	app.controller('IndexController', function(DataService, $scope) {
		this.searchInput = '';
		this.service = DataService;
		this.update = function() {
			console.log('update');
			$scope.$apply();
		};
		this.fetch = function() {
			DataService.searchClub(this.searchInput, this.update);
		};
	});
})();