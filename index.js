var TileReduce = require('tile-reduce');
var turf = require('turf');
var bbox = [4293,6022,14];

//var area = JSON.parse(argv.area);
var opts = {
  zoom: 15,
  tileLayers: [
    {
      name: 'osmdata',
      url: __dirname + '/latest.planet.mbtiles',
      layers: ['osm']
    },
    {
      name: 'tiger',
      url: __dirname + '/tiger.mbtiles',
      layers: ['tiger']
    }
  ],
  map: __dirname + '/difference.js'
};

var tilereduce = TileReduce(bbox, opts);
var diff = turf.featurecollection([]);

tilereduce.on('reduce', function(result){
  diff.features = diff.features.concat(result.features);
});

tilereduce.on('end', function(error){
  console.log(JSON.stringify(diff));
});

tilereduce.on('error', function(err){
  throw err;
});

tilereduce.run();