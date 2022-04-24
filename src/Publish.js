require('@tyler.thayn/js.core')
let Fs = require('fs'), Path = require('path')
let Db = require(Path.resolve('/~/lib/Db'))
let Through = require('through')
let zlib = require('zlib')

let defaults = {
}

module.exports = function (options = {}) {
	options = Extend({}, defaults, options)

	return new Promise((resolve, reject) => {
		Db.query('SELECT @@GLOBAL.secure_file_priv AS folder;', (error, result, fields) => {
			if (error) {return reject(error)}

			let input = Fs.createReadStream(options.path)

			let output = Fs.createWriteStream(Path.resolve(result[0].folder, options.key+'.jpg.gz'))

			input.pipe(zlib.createGzip()).pipe(output)
			output.on('close', () => {
				log(`INSERT INTO tiles.${options.style} (\`id\`, \`image\`) VALUES ('${options.key}', LOAD_FILE('${Path.resolve(result[0].folder, options.key+'.jpg.gz').replace(/\\/g, '\\\\')}'))`)
				Db.query(`INSERT INTO tiles.${options.style} (\`id\`, \`image\`) VALUES ('${options.key}', LOAD_FILE('${Path.resolve(result[0].folder, options.key+'.jpg.gz').replace(/\\/g, '\\\\')}'))`, (error, result, fields) => {
					if (error) {return reject(error)}
					resolve(options)
				})
			})
		})
	})
}
