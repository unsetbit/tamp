// You must run npm install before this can run

var createTamp = require('../');
var _ = require('lodash');

var articles = require('./articles.json');

packIt(articles);

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


	console.log(tamp.toJSON());
}