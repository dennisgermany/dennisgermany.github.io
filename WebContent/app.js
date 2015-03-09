(function() {
	var app = angular.module('angularTT', []);

	app.factory("DataService", function() {
		var mydata = [ ];
		return {
			add : function(data) {
				mydata.push(data);
			},
			all : function() {
				return mydata;
			},
			first : function() {
				return mydata[0];
			},
			last : function() {
				console.log('last');
				return mydata[mydata.length];
			}
		};
	});

	app
			.controller(
					'IndexController',
					function(DataService, $scope) {
						var site = 'http://wttv.click-tt.de/';
						var xpath = '/html/body/div[3]/div[5]/div[1]/ul/li[2]/ul/li[5]/form/select';
						this.options = DataService.all();
						this.result = requestCrossDomain(site, xpath, function(
								data) {
							var result = data.results[0];
							console.log(result);
							DataService.add(result);
							$scope.$apply()
						});
					});
})();

function requestCrossDomain(site, xpath, callback) {

	// If no url was passed, exit.
	if (!site) {
		alert('No site was passed.');
		return false;
	}

	// Take the provided url, and add it to a YQL query. Make sure you encode
	// it!

	var yql = 'http://query.yahooapis.com/v1/public/yql?q='
			+ encodeURIComponent('select * from html where url="' + site
					+ '" and xpath=\'' + xpath + '\'')
			+ '&format=xml&callback=?';

	// Request that YSQL string, and run a callback function.
	// Pass a defined function to prevent cache-busting.

	$.getJSON(yql, cbFunc);

	function cbFunc(data) {
		// If we have something to work with...
		if (data.results[0]) {
			if (typeof callback === 'function') {
				callback(data);
			}
		}
		// Else, Maybe we requested a site that doesn't exist, and nothing
		// returned.
		else
			throw new Error('Nothing returned from getJSON.');
	}
}