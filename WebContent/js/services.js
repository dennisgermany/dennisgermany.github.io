(function() {
	var app = angular.module('services', []);
	app
			.factory(
					"DataService",
					function() {
						var searchClubResult = {
							found : false,
							foundResult : {
								full : '',
								contact : 'Hanno Kessel Kapellenstr. 59, 50226 Frechen Mobil 01737296158 http://www.ttcloevenich.de/',
								location : [ {
									full : 'Albert-Schweitzer-Schule Breslauer Str., 50858 Köln-Weiden Tel 01737296158 www.ttcloevenich.de Routenplaner',
									address : 'Breslauer Str., 50858 Köln-Weiden',
									url : 'https://maps.googleapis.com/maps/api/staticmap?center=Breslauer%20Str.,%2050858%20K%C3%B6ln-Weiden&zoom=10&size=400x400&markers=label:AB%7Ccolor:blue%7CBreslauer%20Str.,%2050858%20K%C3%B6ln-Weiden'
								} ]
							},
							alternatives : []
						};
						this.searchClub = function(search, callback) {
							var site = 'http://wttv.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/clubSearch?federation=WTTV&federations=WTTV&searchFor='
									+ search;
							var xpath = "//html/body/div[3]/div[5]/div[2]/div";
							requestCrossDomain(site, 'HTML', xpath, function(data) {
								var html = $.parseHTML(data.results[0]);
								var jqHtml = $(html);
								var text = $('h1',jqHtml).text();
								if (text.indexOf('Vereinssuche') == -1 ){
									searchClubResult['found'] = true;
								} else {
									searchClubResult['found'] = false;
								}
								if (searchClubResult['found']){
									handleFoundClub(data, searchClubResult);
								} else {
									handleNotFoundClub(data, searchClubResult);
								}
								callback();
							}.bind(searchClubResult));
						};
						this.openClub = function(href, callback){
							var site = href;
							var xpath = "//html/body/div[3]/div[5]/div[2]/div";
							requestCrossDomain(site, 'HTML', xpath, function(data) {
								searchClubResult['full'] = data.results[0];
								handleFoundClub(data, searchClubResult);
								callback();
							}.bind(searchClubResult));
						}
						function handleNotFoundClub(data, searchClubResult) {
							var html = $.parseHTML(data.results[0]);
							var jqHtml = $(html);
							var res = $('table tbody tr td a', jqHtml);
							console.log(searchClubResult);
							searchClubResult['alternatives'].length = 0;
							res
									.each(function(index, data) {
										console.log(searchClubResult);
										var href = 'http://wttv.click-tt.de' + $(data).attr('href');
										var name = $(data).text();
										searchClubResult['alternatives'].push({href:href, name:name});
									}.bind(searchClubResult));
							console.log(searchClubResult['alternatives']);
							foo = res;
							console.log(res);
						}

						function handleFoundClub(data, searchClubResult) {
							var html = $.parseHTML(data.results[0]);
							searchClubResult['foundResult']['contact'] = $(
									$('table tbody tr td p', $(html)).get(1))
									.text();
							searchClubResult['foundResult']['location'][0]['full'] = $(
									$('table tbody tr td table tbody tr td p',
											$(html)).get(1)).text();
							searchClubResult['foundResult']['location'][0]['address'] = searchClubResult['foundResult']['location'][0]['full']
									.split('\n')[1];
							var address = searchClubResult['foundResult']['location'][0]['address'];
							var url = 'https://maps.googleapis.com/maps/api/staticmap?center='
									+ address
									+ '&zoom=10&size=400x400&markers=label:AB|color:blue|'
									+ address;
							searchClubResult['foundResult']['location'][0]['url'] = encodeURI(url);
						}
						this.loadTtrList = function(){
							var fed = 'WTTV';
							var clubNr = '151039';
							var site = 'https://www.mytischtennis.de/secure/iPhoneJoolaRanglisteNURanking.cfm?asynchronous=no&germansRanking=yes&currentRanking=yes&maxRows=150&personId=1234&clubNr='+ clubNr +'&fedNickname=' + fed;
							var xpath = '';
							requestCrossDomain(site, 'XML', xpath, function(data) {
								console.log(data);
							});
						}
						return {
							searchClub : this.searchClub,
							openClub : this.openClub,
							loadTtrList : this.loadTtrList,
							searchClubResult : searchClubResult
						};
					});
})();

var foo = {};