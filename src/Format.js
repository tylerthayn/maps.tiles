require('@tyler.thayn/js.core')
let ChildProcess = require('child_process')
let Fs = require('fs')
let Path = require('path')

let defaults = {
	path: '',
	attributionHeight: 30,
	width: 1024,
	height: 1024,
	style: '',
	key: ''
}

module.exports = function (options = {}) {
	options = Extend({}, defaults, options)

	return new Promise((resolve, reject) => {
		ChildProcess.exec(`magick mogrify ${options.path} -crop ${options.width}x${options.height+options.attributionHeight}+0-${options.attributionHeight} ${options.path}`, (error, stdout, stderr) => {
			if (error) {return reject(error)}
			resolve(options)
		})
	})

}
