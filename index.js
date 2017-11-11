var tileReduce = require('./tile-reduce');
var turf = require('@turf/turf');
var bbox = [2.098388671875,50.47848271564207,6.3775634765625,51.645294049305406];
var fs = require('fs');

var args = process.argv.slice(2);

var outputStream = fs.createWriteStream(args[2]);

var opts = {
  zoom: 14,
  geoJson: {
    "type": "Polygon",
    "coordinates": [
      [
        [
          2.4609375,
          50.68427770577119
        ],
        [
          6.0260009765625,
          50.68427770577119
        ],
        [
          6.0260009765625,
          51.536085601784755
        ],
        [
          2.4609375,
          51.536085601784755
        ],
        [
          2.4609375,
          50.68427770577119
        ]
      ]
    ]
  },
  sources: [
    {
      name: 'ref',
      mbtiles: args[1],
      layers: ["roads"]
    },
    {
      name: 'source',
      mbtiles: args[0],
      layers: ["roads"]
    }
  ],
  requireData: 'any',
  map: __dirname + '/difference.js'
};

var firstFeature = true;
var diff = turf.featureCollection([]);
tileReduce(opts).on('reduce', function(arg1) {
  //diff.features = diff.features.concat(arg1.features);

  //fs.writeFile (args[2], JSON.stringify(diff));

  for (var i = 0; i < arg1.features.length; i++) {
    if (!firstFeature) {
      outputStream.write(',');
    }
    firstFeature = false;
    outputStream.write(JSON.stringify(arg1.features[i]));
  }
})
.on('start', function () {
  outputStream.write('{ "type": "FeatureCollection", "features": [');
})
.on('error', function(err){
  throw err;
})
.on('end', function() {
  // fs.writeFile (args[2], JSON.stringify(diff));

  outputStream.write('] }');
  outputStream.end();
});
