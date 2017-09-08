'use strict';

module.exports = function(data, tile, writeData, done) {
  var count = 0;

  if (data.osm && data.osm.osm && data.osm.osm.features) count += data.osm.osm.features.length;
  if (data.ref && data.ref.ref && data.ref.ref.features) count += data.ref.ref.features.length;
  done(null, count);
};