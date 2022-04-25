require('@tyler.thayn/js.core')
let Fs = require('fs'), Path = require('path')
let MySQL = require('mysql')
let zlib = require('zlib')

let defaults = {
	connectionLimit: 10,
	host: 'localhost',
	user: process.env.mysql_credentials.split(':')[0],
	password: process.env.mysql_credentials.split(':')[1]
}

module.exports = function (options = {}) {
	options = Extend({}, defaults, options)

	let db = MySQL.createPool(options)

	return new Promise((resolve, reject) => {
		db.query('SELECT @@GLOBAL.secure_file_priv AS folder;', (error, result, fields) => {
			if (error) {
				db.end()
				return reject(error)
			}

			let input = Fs.createReadStream(options.path)
			let output = Fs.createWriteStream(Path.resolve(result[0].folder, options.key+'.jpg.gz'))

			input.pipe(zlib.createGzip()).pipe(output)
			output.on('close', () => {
				//log(`INSERT INTO tiles.${options.style} (\`id\`, \`image\`) VALUES ('${options.key}', LOAD_FILE('${Path.resolve(result[0].folder, options.key+'.jpg.gz').replace(/\\/g, '\\\\')}'))`)
				db.query(`INSERT INTO tiles.${options.style} (\`id\`, \`image\`) VALUES ('${options.key}', LOAD_FILE('${Path.resolve(result[0].folder, options.key+'.jpg.gz').replace(/\\/g, '\\\\')}'))`, (error, result, fields) => {
					db.end()
					if (error) {
						return reject(error)
					}
					resolve(options)
				})
			})
		})
	})
}
