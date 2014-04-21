// To run this script you need to `gem install tamper` and also
// run `npm install` within this repo.

var exec = require('child_process').exec;

var rubyResults, nodeResults;
exec('ruby ./encode_articles.rb', {cwd: __dirname}, 
	function(error, stdout, stderr){
		if(error){
			console.log('Error when running ruby encoder!');
			console.log(error);
			console.log(stderr);
			return;
		}

		rubyResults = stdout.trim();
		if(nodeResults) compareResults();
});

exec('node ./encodeArticles.js', {cwd: __dirname}, 
	function(error, stdout, stderr){
		if(error){
			console.log('Error when running tamp!');
			console.log(error);
			console.log(stderr);
			return;
		}

		nodeResults = stdout.trim();
		if(rubyResults) compareResults();
});

function compareResults(){
	console.log('Got this from Ruby encoder:');
	console.log(rubyResults);
	console.log('');
	console.log('Got this from Tamp:');
	console.log(nodeResults);
	console.log('');
	if(rubyResults === nodeResults){
		console.log('They match!');
	} else {
		console.log('They don\'t match!');
	}
}