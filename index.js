var tileReduce = require('@mapbox/tile-reduce');
var turf = require('@turf/turf');
var bbox = [4293,6022,14];

//var area = JSON.parse(argv.area);
var opts = {
  zoom: 15,
  sources: [
    {
      name: 'osmdata',
      url: __dirname + '/data/antwerp.mbtiles',
      layers: ['osm']
    },
    {
      name: 'wegenregister',
      url: __dirname + '/data/wegenregister.mbtiles',
      layers: ['wegenregister']
    }
  ],
  map: __dirname + '/difference.js',
  bbox: bbox
};

var diff = turf.featureCollection([]);

console.log(diff);

tileReduce(opts).on('reduce', function(num) {
  diff.features = diff.features.concat(result.features);
})
.on('error', function(err){
  throw err;
})
.on('end', function() {
  console.log(JSON.stringify(diff));
});