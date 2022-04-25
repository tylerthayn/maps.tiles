require('@tyler.thayn/js.core')
let Fs = require('fs')
let Path = require('path')

let defaults = {
	db: Path.resolve('M:/db')
}

module.exports = function (options = {}) {
	options = Extend({}, defaults, options)

	return new Promise((resolve, reject) => {
		let destination = Path.resolve(options.db, options.style, options.key+'.jpg')
		try {Fs.mkdirSync(Path.dirname(destination), {recursive: true})} catch (e) {}

		Fs.copyFile(options.path, destination, error => {
			if (error) {return reject(error)}
			resolve(Extend({}, options, {path: destination}))
		})
	})

}
