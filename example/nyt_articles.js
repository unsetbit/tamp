var createTamp = require('../');
var request = require('request');
var _ = require('lodash');

var API_KEY = '';
var queryURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + API_KEY;

var articles = [];
var requestIndex = 0, 
	requestCount = 10;

var responseCounter = 0;
for(; requestIndex < requestCount; requestIndex++){
	var reqUrl = queryURL + "&page=" + requestIndex;
	
	request(reqUrl, function(error, response, body){
		body = JSON.parse(body);
		articles = articles.concat(body.response.docs);
		responseCounter++;
		if(responseCounter === requestCount) packIt(articles);
	});
}


function packIt(articles){
	articles = articles.filter(function(article){
		return article.byline && article.byline.original;
	});

	articles.forEach(function(article, index){
		article.id = index;
	});

	var possibilities = {
		sectionName: articles.map(function(a){
			return a.section_name;
		}).filter(function(a, index, list){
			return a && !~list.indexOf(a, index + 1);
		}).sort(),
		byline: articles.map(function(a){
			return a.byline.original;
		}).filter(function(a, index, list){
			return !~list.indexOf(a, index + 1);
		}).sort()
	}

	var tamp = createTamp();

	tamp.addAttribute({
		attrName: 'byline',
		possibilities: possibilities.byline,
		maxChoices: 1
	});

	tamp.addAttribute({
		attrName: 'section_name',
		possibilities: possibilities.sectionName,
		maxChoices: 1
	});

	tamp.pack(articles.map(function(a){
		return {
			id: a.id,
			section_name: a.section_name,
			byline: a.byline.original
		}
	}));

	console.log('Tamper pack:');
	console.log(tamp.toJSON());
}