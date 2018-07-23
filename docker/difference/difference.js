var turf = require('@turf/turf'),
  flatten = require('geojson-flatten'),
  normalize = require('@mapbox/geojson-normalize'),
  tilebelt = require('@mapbox/tilebelt'),
  fs = require('fs'),
  hashF = require('object-hash'),
  fx = require('mkdir-recursive');

module.exports = function(data, tile, writeData, done) {
  var refDeltas = turf.featureCollection([]);
  var streetBuffers = undefined;
  var refRoads = undefined;
  var refRoadType = undefined;
  var refRoadsLength = 0;
  var diffRoadsLength = 0;
  var debugDir = "/home/xivk/work/osmbe/road-completion/debug/";
  if (!fs.existsSync(debugDir)) {
    debugDir = undefined;
  }

  try {
    if (tile[2] == 14)
    {
      var tileDir = tile[2] + "/" + tile[0] + "/";
      var tileName = tile[1] + ".geojson";
      var osmDataDir = debugDir + "osmdata/" + tileDir;
      var refRoadsDir = debugDir + "refroads/" + tileDir;
      var osmBuffersDir = debugDir + "osmbuffers/" + tileDir;
      var diffsDir = debugDir + "diffs/" + tileDir;
      if (debugDir) {
        if (!fs.existsSync(osmDataDir)){
          fx.mkdirSync(osmDataDir);
        }
        if (!fs.existsSync(refRoadsDir)){
          fx.mkdirSync(refRoadsDir);
        }
        if (!fs.existsSync(osmBuffersDir)){
          fx.mkdirSync(osmBuffersDir);
        }
        if (!fs.existsSync(diffsDir)){
          fx.mkdirSync(diffsDir);
        }
      }
      
      // concat feature classes and normalize data
      refRoads = normalize(data.ref.roads);
      if (data.source) {
        var osmData = normalize(data.source.roads);

        if (debugDir) {
          fs.writeFile (osmDataDir + tileName, JSON.stringify(osmData));
          fs.writeFile (refRoadsDir + tileName, JSON.stringify(refRoads));
        }

        osmData = flatten(osmData);
        refRoads = flatten(refRoads);
        
        //refRoads.features.forEach(function(road, i) {
          //if (filter(road)) refRoads.features.splice(i,1);
        //});

        // buffer streets
        streetBuffers = osmData.features.map(function(f){
          var buffer = turf.buffer(f.geometry, 20, 'meters');
          if (buffer) return buffer;
        });
        
        var merged = streetBuffers[0];
        for (var i = 1; i < streetBuffers.length; i++) {
          merged = turf.union(merged, streetBuffers[i]);
        }

        merged = turf.simplify(merged, 0.000001, false);
        streetBuffers = normalize(merged);
        

        //**
        //buffer = turf.simplify(buffer, 0.000001, false);
        //streetBuffers = normalize(buffer); 
        //**

        if (debugDir) {
          fs.writeFile (osmBuffersDir + tileName, JSON.stringify(merged));
        }

        if (refRoads && streetBuffers) {
          refRoads.features.forEach(function(refRoad){
            streetBuffers.features.forEach(function(streetsRoad){
              var roadDiff = turf.difference(refRoad, streetsRoad);
              refRoadType = refRoad.geometry.type;
              if(roadDiff && !filter(roadDiff, refRoadType)){
                refRoadsLength += turf.lineDistance(refRoad);
                diffRoadsLength += turf.lineDistance(roadDiff);
                // Compare to see if there is a difference in their names
                  
                  if( refRoad.geometry.type === "Polygon" && CompareByTags(refRoad.properties.name, streetsRoad.properties.name)) {
                    if(refRoad.properties.bridge || refRoad.properties.tunnel || refRoad.properties.cobblestone) {
                      if(!CompareByTag(streetsRoad.properties.bridge) || !CompareByTag(streetsRoad.properties.tunnel) || !CompareCobblestone(streetsRoad.properties.surface)) refDeltas.features.push(roadDiff);
                    }
                    else  refDeltas.features.push(roadDiff);
                  }
                  
                } 
            });
          });
        }
      } else {
        refDeltas = refRoads;
      }

      // add hashes as id's and tile-id's.
      for (var f = 0; f < refDeltas.features.length; f++) {
        var feature = refDeltas.features[f];
        if (feature &&
            feature.geometry) {

            // 07/09** I think we could hash the tiles too (property part of feature)
            //hash = hashF(feature);
            //hash = hashF(feature.geometry); 
            
            // 07/10** 1st try to make the hashing system
            //get the coordinates from the geojson files
            
            NotConfirmedHashCodeException.prototype = Object.create(Error.prototype);
            NotConfirmedHashCodeException.prototype.name = "NotConfirmedHashCodeException";
            NotConfirmedHashCodeException.prototype.constructor = NotConfirmedHashCodeException;
            var coords = 0;
            var hash = undefined;

            try {
              if(feature.geometry.type === "Polygon") {
                for(var c = 0; c < feature.geometry.coordinates.length; c++){
                  for(var d = 0; d < feature.geometry.coordinates[c].length; d++){
                    for(var e = 0; e < feature.geometry.coordinates[c][d].length; e++){
                      coords += feature.geometry.coordinates[c][d][e];
                    }
                  }
                }
              }
              else {
                for(var c = 0; c < feature.geometry.coordinates.length; c++){
                  for(var d = 0; d < feature.geometry.coordinates[c].length;d++){
                    coords += feature.geometry.coordinates[c][d];
                  }
                }
              }
              hash = getNewHash( hashF(feature.properties), hashF(coords));
              if(hash === null || hash === "") {
                throw new NotConfirmedHashCodeException();
            }

            }catch(err) {
                err = new NotConfirmedHashCodeException("Impossible to hash coordinates and properties");
                console.log(err.toString());
              }

          feature.properties.id = "" + hash;
          feature.properties.tile_z = tile[2];
          feature.properties.tile_x = tile[0];
          feature.properties.tile_y = tile[1];
        }
      }

      if (debugDir) {
        fs.writeFile (diffsDir + tileName, JSON.stringify(normalize(refDeltas)));
      }
    }
  }
  catch (e)
  {
    console.log("Could not process tile " + tileName + ": " + e.message);
    console.log(e);
  }

  done(null, { 
    type: refRoadType,
    diffs: refDeltas,
    buffers: streetBuffers,
    refs: refRoads,
    osm: osmData,
    stats: {  // try to send them only if it's a LineString document
      total: refRoadsLength,
      diff: diffRoadsLength
    }
   });
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

function filter(road, type = "Polygon") {
  if(type === "Polygon") {
    var area = turf.area(road, 'kilometers');
    if(area < 350) {
      return true;
    } else {
      return false;
    }
  }
  else {
    var length = turf.lineDistance(road, 'kilometers');
    if (length < 0.03) {
      return true;
    } else {
      return false;
    }
  }
}

function getNewHash(featcoords, hashedcoords) {
  NotNewHashCodeGenerationException.prototype = Object.create(Error.prototype);
  NotNewHashCodeGenerationException.prototype.name = "NotNewHashCodeGenerationException";
  NotNewHashCodeGenerationException.prototype.constructor = NotNewHashCodeGenerationException;

  var hashresult = "";
  let hashnb = 17;
  try {
      hashresult = featcoords + hashedcoords;
      /*
      for(let i = 0; i < hashedcoords.length;i++) {
        hashnb = (((hashnb << 5) - hashnb ) + hashedcoords.charCodeAt(i)) & 0xFFFFFFFF;
      }
      for(let i = 0; i < featcoords.length;i++) {
        hashnb = (((hashnb << 5) - hashnb ) + featcoords.charCodeAt(i)) & 0xFFFFFFFF;
      }
      hashresult = hashnb.toString();*/
      return hashresult;
      

  }catch(err){
    err = new NotNewHashCodeGenerationException("Data are invalid or hashing process doesn't work please report to getNewHash function");
    console.log(err.toString());
  }
}

function CompareByTags(refTag, sourceTag) {
  if(refTag !== sourceTag) return true;
  else return false;
}

function CompareByTag(refTag) {
  if(refTag === "yes") return true;
  else return false;
}

function CompareCobblestone(refTag) {
  if (refTag === "sett" || refTag === "unhewn_cobblestone" || refTag === "cobblestone") return true;
  else return false;
}

function NotNewHashCodeGenerationException(message) {
    this.message = message;
    if("captureStackTrace" in Error) Error.captureStackTrace(this, NotNewHashCodeGenerationException);
    else this.stack = (new Error()).stack;
  }
function NotConfirmedHashCodeException(message) {
    this.message = message;
    if("captureStackTrace" in Error) Error.captureStackTrace(this, NotConfirmedHashCodeException);
    else this.stack = (new Error()).stack;
  }