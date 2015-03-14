(function() {
	var app = angular.module('services', []);
	app
			.factory(
					"DataService",
					function() {
						var searchClubResult = {
							full : '',
							contact : 'Hanno Kessel Kapellenstr. 59, 50226 Frechen Mobil 01737296158 http://www.ttcloevenich.de/',
							location : [ {
								full : 'Albert-Schweitzer-Schule Breslauer Str., 50858 Köln-Weiden Tel 01737296158 www.ttcloevenich.de Routenplaner',
								address : 'Breslauer Str., 50858 Köln-Weiden',
								url : 'https://maps.googleapis.com/maps/api/staticmap?center=Breslauer%20Str.,%2050858%20K%C3%B6ln-Weiden&zoom=10&size=400x400&markers=label:AB%7Ccolor:blue%7CBreslauer%20Str.,%2050858%20K%C3%B6ln-Weiden'
							} ]
						};
						this.searchClub = function(name, callback) {
							var site = 'http://wttv.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/clubSearch?federation=WTTV&federations=WTTV&searchFor='
									+ name;
							var xpath = "//html/body/div[3]/div[5]/div[2]/div";
							requestCrossDomain(site, xpath, function(data) {
								searchClubResult['full'] = data.results[0];
								handleNotFoundClub(data, callback);
								// handleFoundClub(data, callback);
								callback();
							}.bind(searchClubResult));
						};
						function handleNotFoundClub(data) {
							var html = $.parseHTML(data.results[0]);
							var jqHtml = $(html);
							var res = $('table tbody tr td a', jqHtml);
							res.each(function(index, data) {
								var href= $(data).attr('href');
								var name= $(data).text();
								console.log(href + " --> " + name);
							});
							foo = res;
							console.log(res);
						}

						function handleFoundClub(data) {
							var html = $.parseHTML(data.results[0]);
							searchClubResult['contact'] = $(
									$('table tbody tr td p', $(html)).get(1))
									.text();
							searchClubResult['location'][0]['full'] = $(
									$('table tbody tr td table tbody tr td p',
											$(html)).get(1)).text();
							searchClubResult['location'][0]['address'] = searchClubResult['location'][0]['full']
									.split('\n')[1];
							var address = searchClubResult['location'][0]['address'];
							var url = 'https://maps.googleapis.com/maps/api/staticmap?center='
									+ address
									+ '&zoom=10&size=400x400&markers=label:AB|color:blue|'
									+ address;
							searchClubResult['location'][0]['url'] = encodeURI(url);
						}
						return {
							searchClub : this.searchClub,
							searchClubResult : searchClubResult
						};
					});
})();

var foo = {};