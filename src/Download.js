require('@tyler.thayn/js.core')
let Maps = require('@tyler.thayn/maps.core')
let Fs = require('fs')
let Https = require('https')
let Path = require('path')

let basemaps = {
	dark: 'dark-v10',
	light: 'light-v10',
	topo: 'outdoors-v11',
	satellite: 'satellite-v9',
	hybrid: 'satellite-streets-v11',
	streets: 'streets-v11'
}

let defaults = {
	attempts: 4,
	attributionHeight: 30,
	width: 1024,
	height: 1024,
	folder: Path.resolve(process.env.TEMP, 'maps')
}

module.exports = function (style, key, options = {}) {
	return new Promise((resolve, reject) => {
		options = Extend({}, defaults, options, {style: style, key: key})

		let tile = new Maps.Tile(key)
		tile.bounds[1] -= options.attributionHeight * ((tile.bounds[3] - tile.bounds[1])/ options.height)

		options.url = `https://api.mapbox.com/styles/v1/mapbox/${basemaps[style]}/static/[${tile.bounds.map(b=>{return b.toFixed(8)}).join(',')}]/${options.width}x${options.height+options.attributionHeight}?access_token=${process.env.MapboxApiToken}`
		options.path = Path.resolve(options.folder, style, key+'.jpg')
		try {Fs.mkdirSync(Path.dirname(options.path), {recursive: true})} catch (e) {}

		let attempts = 0
		let Download = function () {
			attempts++
			if (++attempts < options.attempts) {
				Https.get(options.url, res => {
					if (res.statusCode !== 200) {return Download()}
					let output = Fs.createWriteStream(options.path)
					res.pipe(output)
					res.on('error', (error) => {return Download()})
					res.on('end', () => {
						Fs.stat(options.path, (error, stats) => {
							if (error) {return Download()}
							if (stats.size != res.headers['content-length']) {
								output.destroy()
								return Download()
							} else {
								resolve(options)
							}
						})
					})
				})
			} else {
				reject(new Error('Max attempts'))
			}
		}

		Download()
	})
}
