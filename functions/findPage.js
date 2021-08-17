const fs = require('fs').promises
const Fuse = require('fuse.js')

module.exports = find;

 function find(args) {
	return fs.readFile('Unsounded Transcription.txt', 'utf8')
		.then(text => search(args, text))
};

function search(args, text) {
	
	const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
	const transcriptArray = [...text.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));

	const options = {
		includeScore: true,
		ignoreLocation: true,
		minMatchCharLength: 2,
		threshold: 0.5,
		// Search in `author` and in `tags` array
		keys: ['name', 'text']
	  }
	  
	  const fuse = new Fuse(transcriptArray, options)

	try {
		let foundPage = fuse.search(args)[0].item.name;
		
		return {'pageNumber': foundPage}
	}

	catch {
		return {'pageNumber': 'Couldn\'t find a match'}
	}

};