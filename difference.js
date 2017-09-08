var turf = require('@turf/turf'),
  flatten = require('geojson-flatten'),
  normalize = require('@mapbox/geojson-normalize'),
  tilebelt = require('@mapbox/tilebelt');

module.exports = function(data, tile, writeData, done) {
  
  // concat feature classes and normalize data
  var refRoads = normalize(data.ref.ref);
  var osmData = normalize(data.osm.osm);

  var refDeltas = turf.featureCollection([]);

  // filter out roads that are shorter than 30m and have no name
  if (refRoads && osmData){

    console.log("data, yeah!")

    refRoads.features.forEach(function(road, i) {
      if (filter(road)) refRoads.features.splice(i,1);
    });

    // clip features to tile
    osmData = clip(osmData, tile);
    refRoads = clip(refRoads, tile);
    osmData = normalize(flatten(osmData));
    refRoads = normalize(flatten(refRoads));

    // buffer streets
    var streetBuffers = turf.featureCollection([]);
    streetBuffers.features = osmData.features.map(function(f){
      return turf.buffer(f.geometry, 20, 'meters').features[0];
    });
    streetBuffers = normalize(turf.union(streetBuffers.features.map(function(f){
      return f.geometry;
    })));

    // erase street buffer from tiger lines

    if (refRoads && streetBuffers) {
      refRoads.features.forEach(function(refRoad){
        streetBuffers.features.forEach(function(streetsRoad){
            var roadDiff = turf.erase(refRoad, streetsRoad);
            if(roadDiff && !filter(roadDiff)) tigerDeltas.features.push(roadDiff);
        });
      });
    }
  }

  done(null, refDeltas);
};

function clip(lines, tile) {
  lines.features = lines.features.map(function(line){
    try {
      var clipped = turf.intersect(line, turf.polygon(tilebelt.tileToGeoJSON(tile).coordinates));
      return clipped;
    } catch(e){
      return;
    }
  });
  lines.features = lines.features.filter(function(line){
    if(line) return true;
  });
  lines.features = lines.features.filter(function(line){
    if(line.geometry.type === 'LineString' || line.geometry.type === 'MultiLineString') return true;
  });
  return lines;
}

function filter(road) {
  var length = turf.lineDistance(road, 'kilometers');
  if (length < 0.03 || road.properties.fullname == '') {
    return true;
  } else {
    return false;
  }
}
