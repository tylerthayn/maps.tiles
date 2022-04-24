require('@tyler.thayn/js.core')
let Maps = require('@tyler.thayn/maps.core')
let ChildProcess = require('child_process')
let Fs = require('fs'), Path = require('path')

let basemaps = {
	dark: 'dark-v10',
	light: 'light-v10',
	topo: 'outdoors-v11',
	satellite: 'satellite-v9',
	hybrid: 'satellite-streets-v11',
	streets: 'streets-v11'
}

let defaults = {
	bin: Path.resolve(__dirname, 'exiftool.exe')
}

module.exports = function (options = {}) {
	options = Extend({}, defaults, options)

	return new Promise((resolve, reject) => {
		let tile = new Maps.Tile(options.key)

		let tags = {
			Artist: 'Mapbox',
			Album: basemaps[options.style],
			Location: JSON.stringify(tile.bounds),
			Genre: `${basemaps[options.style]}`,
			Notes: JSON.stringify({slippy: tile.slippy, key: tile.key}),
			Title: `/${tile.slippy.join('/')} Mapbox ${options.style.Capitalize()} ${tile.key}`,
			Url: `http://maps.ttx.us.to/tiles/${options.style}/${tile.slippy.join('/')}?view`
		}

		let exifTool = ChildProcess.spawn(Path.resolve(options.bin), Object.keys(tags).map(tag => `-${tag}=${tags[tag]}`).concat([options.path, '-overwrite_original']))
		exifTool.on('error', reject)
		//exifTool.stdout.on('data', chunk => {log(chunk)})
		exifTool.on('close', code => {resolve(options)})

	})
}
