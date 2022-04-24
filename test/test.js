
let Tiles = require('@maps/tiles')


Tiles.Download('hybrid', '0231000303').then(Tiles.Format).then(Tiles.Tag).then(log).catch(log)


