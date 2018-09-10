const fs = require('fs');
const path = require('path');

const envVars = {
	'{{domain}}': process.env.DOMAIN,
	'{{internal_ip}}': process.env.INTERNAL_IP,
	'{{external_ip}}': process.env.EXTERNAL_IP
};

function readDir(dir) {
	return new Promise((resolve, reject) => {
		const normalisedPath = path.join(__dirname, dir);
		fs.readdir(normalisedPath, (err, files) => {
			if (err) {
				return reject(err);
			}

			resolve(files);
		});
	});
}

function readFile(file) {
	return new Promise((resolve, reject) => {
		const normalisedPath = path.join(__dirname, file);
		fs.readFile(normalisedPath, 'utf8', (err, content) => {
			if (err) {
				return reject(err);
			}

			resolve(content);
		});
	});
}

function writeFile(file, content) {
	return new Promise((resolve, reject) => {
		const normalisedPath = path.join(__dirname, file);
		fs.writeFile(normalisedPath, content, (err) => {
			if (err) {
				return reject(err);
			}

			resolve(true);
		});
	});
}

function replaceContent(content) {
	const froms = Object.keys(envVars);
	for (const from of froms) {
		const to = envVars[from];

		const fromRegex = new RegExp(from, 'g');
		content = content.replace(fromRegex, to);
	}

	return content;
}

function modifyFile(file) {
	return new Promise((resolve, reject) => {
		readFile(file)
			.then((content) => {
				const newContent = replaceContent(content);
				if (content === newContent) {
					return resolve(true);
				} else {
					return writeFile(file, newContent)
						.then(resolve)
						.catch(reject);
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
}

readDir('.')
	.then((files) => {
		const promises = files.map((file) => {
			// Avoid this file
			if (!file.includes('js')) {
				return modifyFile(file);
			} else {
				return Promise.resolve(true);
			}
		});
		return Promise.all(promises);
	})
	.then((results) => {
		let success = true;
		for (const result of results) {
			if (!result) {
				success = false;
			}
		}

		if (!success) {
			throw new Error('Couldn\'t modify config files');
		}

		console.log('Success modifying config files')
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
