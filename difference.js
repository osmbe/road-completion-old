var turf = require('@turf/turf'),
  flatten = require('geojson-flatten'),
  normalize = require('@mapbox/geojson-normalize'),
  tilebelt = require('@mapbox/tilebelt'),
  fs = require('fs');

module.exports = function(data, tile, writeData, done) {
  var refDeltas = turf.featureCollection([]);

  try {
    if (tile[2] == 14)
    {
      var tileName = "" + tile[2] + "-" + tile[0] + "-" + tile[1];

      // concat feature classes and normalize data
      var osmData = normalize(data.osm.osm);
      var refRoads = normalize(data.ref.ref);

      //fs.writeFile ("/home/xivk/work/osmbe/road-completion/debug/osmdata-normalized-" +  tile[0] + "-" + tile[1] + "-" + tile[2] +".json", JSON.stringify(osmData));
      //fs.writeFile ("/home/xivk/work/osmbe/road-completion/debug/refroads-normalized-" +  tile[0] + "-" + tile[1] + "-" + tile[2] +".json", JSON.stringify(refRoads));

      osmData = flatten(osmData);
      refRoads = flatten(refRoads);

      //fs.writeFile ("/home/xivk/work/osmbe/road-completion/debug/" + tileName + "-osmdata-flattened.json", JSON.stringify(osmData));
      //fs.writeFile ("/home/xivk/work/osmbe/road-completion/debug/" + tileName + "-refroads-flattened.json", JSON.stringify(refRoads));
      
      refRoads.features.forEach(function(road, i) {
        if (filter(road)) refRoads.features.splice(i,1);
      });

      // buffer streets
      var streetBuffers = osmData.features.map(function(f){
        var buffer = turf.buffer(f.geometry, 20, 'meters');
        if (buffer) return buffer;
      });

      //fs.writeFile ("/home/xivk/work/osmbe/road-completion/debug/osmdata-buffered-" + tile[0] + "-" + tile[1] + "-" + tile[2] +".json", JSON.stringify(normalize(streetBuffers)));

      var merged = streetBuffers[0];
      for (var i = 1; i < streetBuffers.length; i++) {
        merged = turf.union(merged, streetBuffers[i]);
      }
      
      //fs.writeFile ("/home/xivk/work/osmbe/road-completion/debug/osmdata-buffered-merged" + tile[0] + "-" + tile[1] + "-" + tile[2] +".json", JSON.stringify(normalize(merged)));

      merged = turf.simplify(merged, 0.00001, false);

      //fs.writeFile ("/home/xivk/work/osmbe/road-completion/debug/" + tileName + "-osmdata-buffered-merged-simplified.json", JSON.stringify(normalize(merged)));

      streetBuffers = normalize(merged);
      if (refRoads && streetBuffers) {
        refRoads.features.forEach(function(refRoad){
          streetBuffers.features.forEach(function(streetsRoad){
              var roadDiff = turf.difference(refRoad, streetsRoad);
              if(roadDiff && !filter(roadDiff)) refDeltas.features.push(roadDiff);
          });
        });
      }

      //fs.writeFile ("/home/xivk/work/osmbe/road-completion/debug/" + tileName + "-diff.json", JSON.stringify(normalize(refDeltas)));
    }
  }
  catch (e)
  {
    console.log(e);
  }

  done(null, refDeltas) ; //, refDeltas, streetBuffers, refRoads, osmData);
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
