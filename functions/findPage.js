const fs = require('fs').promises;
const si = require('search-index');

module.exports = find;

 function find(args) {
	return fs.readFile('Unsounded Transcription.txt', 'utf8')
		.then(text => search(args, text));
}

async function search(args, text) {

	const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
	const transcriptArray = [...text.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));

	const db = await si();
	await db.PUT(transcriptArray);
	return await db.QUERY({ SEARCH: [args] });

}