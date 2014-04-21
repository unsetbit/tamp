var createTamp = require('../');

// Setup some fake data for our example
var FOR_EXAMPLE = {
	attrName: 'snack',
	possibilities: [
		'popcorn',
		'caramel',
		'bacon'
	],
	data: [
		{id: 0, snack: 'popcorn'},
		{id: 1, snack: 'popcorn'},
		{id: 2, snack: 'popcorn'},
		{id: 3, snack: 'popcorn'},
		{id: 4, snack: 'popcorn'},
		{id: 5, snack: 'caramel'},
		{id: 6, snack: 'popcorn'},
		{id: 7, snack: 'popcorn'},
		{id: 8, snack: 'caramel'},
		{id: 9, snack: 'caramel'},
		{id: 10, snack: 'popcorn'},
		{id: 11, snack: 'popcorn'},
		{id: 12, snack: 'bacon'},
		{id: 13, snack: 'popcorn'},
		{id: 14, snack: 'popcorn'},
	]
};

// Initialize tamp
var tamp = createTamp();

// Add a packed attribute
tamp.addAttribute({
	attrName: FOR_EXAMPLE.attrName,
	possibilities: FOR_EXAMPLE.possibilities,
	maxChoices: 1
});

tamp.pack(FOR_EXAMPLE.data);

console.log('Tamper pack:');
console.log(tamp.toJSON());
