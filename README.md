# Tamp
Tamp is an encoder for [Tamper](http://nytimes.github.io/tamper/) written in JavaScript. Tamper a categorical data serialization protocol, for more info on, visit the [Project Homepage](http://nytimes.github.io/tamper/).

## Install
To install the latest pubished version, execute `npm install tamp` in your terminal.

To install the latest development version, do this in your terminal:
```
git clone git://github.com/oztu/tamp.git
cd tamp
npm install
npm link
```

## Usage
```
var createTamp = require('tamp');

// Initialize tamp
var tamp = createTamp();

// Add a packed attribute (or more)
tamp.addAttribute({
	attrName: FOR_EXAMPLE.attrName,
	possibilities: FOR_EXAMPLE.possibilities,
	maxChoices: FOR_EXAMPLE.maxChoices
});

// Encode the data
tamp.pack(FOR_EXAMPLE.data);

// Get packed data
var myPackedData = tamp.toJSON();
```

## More info
* [Protocol specs](https://github.com/NYTimes/tamper/wiki/Packs)
* [Decoder](https://github.com/NYTimes/tamper/tree/master/clients/js) (Unfortunately unstable as of April 21, 2014)