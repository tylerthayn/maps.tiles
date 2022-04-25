require('@tyler.thayn/js.core')
let Maps = require('@tyler.thayn/maps.core')
let Path = require('path')
let Fs = require('fs')
let Db = require(Path.resolve('/~/lib/Db'))
let zlib = require('zlib')
let Through = require('through')
let From = require('from')

let Download = require('./Download')
let Format = require('./Format')
let Tag = require('./Tag')
let Publish = require('./Publish')


let tile = new Maps.Tile(Maps.places.wellington, 17)
Db.query(`SELECT image FROM tiles.hybrid WHERE id = ${tile.key}`, (error, result, fields) => {
	let start = 0

	let t = Through(
		function Write (data) {
			this.queue(data)
		},
		function End () {
			this.queue(null)
		}
	)

	t.pipe(zlib.createGunzip()).pipe(Fs.createWriteStream('data.jpg'))
	t.queue(result[0].image)

	/*
From(function getChunk(count, next) {
		if (start >= result[0].image.length) {
			this.emit('end')
		} else if (start+count > result[0].image.length) {
			count = result[0].image.length - start
		}
		let data = result[0].image.slice(start, count)
		start += count
		this.emit('data', data)

		next()
	}).pipe(zlib.createGunzip()).pipe(Fs.createWriteStream('data.jpg'))
	*/
//	Fs.writeFile('data.jpg.gz', result[0].image, (error) => {
//		if (error) {return reject(error)}
//		Fs.createReadStream('data.jpg.gz').pipe(zlib.createGunzip()).pipe(Fs.createWriteStream('data.jpg'))
//	})
})

/*
Db.query(`SELECT image FROM tiles.hybrid WHERE id = ${tile.key}`).stream().pipe(Through(
	function Write (data) {
		log(data.toString())
		this.queue(data)
	},
	function End () {
		this.queue(null)
	}
)).pipe(zlib.createGunzip()).pipe(Fs.createWriteStream('out.jpg'))
*/
/*
Download('hybrid', tile.key, {})
	.then(options => {
		return Format(options)
	}).then(options => {
		return Tag(options)
	}).then(options => {
		return Publish(options)
	}).catch(log)
*/
