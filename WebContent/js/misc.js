function requestCrossDomain(site, type, xpath, callback) {

	// If no url was passed, exit.
	if (!site) {
		alert('No site was passed.');
		return false;
	}

	// Take the provided url, and add it to a YQL query. Make sure you encode
	// it!
	if (type == 'HTML'){
		var yql = 'http://query.yahooapis.com/v1/public/yql?q='
			+ encodeURIComponent('select * from html where url="' + site
					+ '" and xpath=\'' + xpath + '\'')
			+ '&format=xml&callback=?';
	}
	if (type == 'XML'){
		var yql = 'http://query.yahooapis.com/v1/public/yql?q='
			+ encodeURIComponent('select * from xml where url="' + site + '"')
			+ '&format=xml&callback=?';
	}
	

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