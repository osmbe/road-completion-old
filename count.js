'use strict';

module.exports = function(data, tile, writeData, done) {
  var count = 1;

  if (data.osm && data.osm.osm && data.osm.osm.features) count += data.osm.osm.features.length;
  done(null, count);
};