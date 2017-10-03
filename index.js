var tileReduce = require('@mapbox/tile-reduce');
var turf = require('@turf/turf');
var bbox = [4.2881011962890625,51.14230962196141,4.5298004150390625,51.28296416385857];

var args = process.argv.slice(2);

var opts = {
  zoom: 14,
  sources: [
    {
      name: 'osm',
      mbtiles: args[0],
      layers: ["osm"]
    },
    {
      name: 'ref',
      mbtiles: args[1],
      layers: ["ref"]
    }
  ],
  map: __dirname + '/difference.js'
};

var diff = turf.featureCollection([]);
tileReduce(opts).on('reduce', function(arg1) {
  diff.features = diff.features.concat(arg1.features);
})
.on('start', function () {
  console.log('starting');
})
.on('error', function(err){
  throw err;
})
.on('end', function() {
  console.log(JSON.stringify(diff));
});