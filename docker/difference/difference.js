var turf = require('@turf/turf'),
  flatten = require('geojson-flatten'),
  normalize = require('@mapbox/geojson-normalize'),
  tilebelt = require('@mapbox/tilebelt'),
  fs = require('fs'),
  hashF = require('object-hash'),
  fx = require('mkdir-recursive');

module.exports = function(data, tile, writeData, done) {
  /* refDeltas is a featureCollection (array of features) it permits the stockage of our issues 
    streetBuffers is the variable that contains the buffers created on the basis of OSM source data
    refRoads is the variable that contains the open data reference source
    refRoadType takes the type of the feature we are actually processing and permits us to have clearer statements while comparing the tags (useful if we use two inputs (one with Polygons & the other one with LineStrings))
    RefRoads & diffRoads -length are the variables for calculating the total length of the open data reference source 
  */
  var refDeltas = turf.featureCollection([]);
  var streetBuffers = undefined;
  var refRoads = undefined;
  var refRoadType = "";
  var refRoadsLength = 0;
  var diffRoadsLength = 0;
  var refRoadsCount = 0;
  var debugDir = "/home/xivk/work/osmbe/road-completion/debug/";
  var errorMessage = "";
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
      // setting up the debug directory
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
        
        if (debugDir) {
          fs.writeFile (osmBuffersDir + tileName, JSON.stringify(merged));
        }

        refRoadsCount += refRoads.features.length;

        if (refRoads && streetBuffers) {
          refRoads.features.forEach(function(refRoad){
            refRoadsLength += turf.lineDistance(refRoad);
            streetBuffers.features.forEach(function(streetsRoad){
              var roadDiff = turf.difference(refRoad, streetsRoad);
              refRoadType = refRoad.geometry.type;
              if(roadDiff && !filter(roadDiff, refRoadType)) {
                // Here we are trying to calculate the distance of the reference roads & the issues (output of the difference between reference and source inputs)
                //refRoadsLength += turf.lineDistance(refRoad);
                //diffRoadsLength += turf.lineDistance(roadDiff);
                  
                  
                  //if( refRoad.geometry.type === "Polygon" && CompareByTags(refRoad.properties.name, streetsRoad.properties.name)) {
                    //if(refRoad.properties.bridge || refRoad.properties.tunnel || refRoad.properties.cobblestone) {
                      //if(!CompareByTag(streetsRoad.properties.bridge) || !CompareByTag(streetsRoad.properties.tunnel) || !CompareCobblestone(streetsRoad.properties.surface)) refDeltas.features.push(roadDiff);
                    //}
                    //else  
                    diffRoadsLength += turf.lineDistance(roadDiff);
                    refDeltas.features.push(roadDiff);
                  //}
                  
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
              // There is two loops over there one for the Polygons and one for the LineStrings, when we use LineStrings long/lat are in an array & those arrays are in another array
              // for the polygons it's the same process but with one more array
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
              // this function permits us to make a unique hash for each feature
              hash = getNewHash( hashF(feature.properties), hashF(coords));
              if(hash === null || hash === "") {
                throw new NotConfirmedHashCodeException();
            }

            }catch(err) {
                err = new NotConfirmedHashCodeException("Impossible to hash coordinates and properties");
                console.log(err.toString());
              }
          
              // Here we are setting up the properties for the feature we are processing as its unique identifier and his tile coordinates
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
    errorMessage = "Could not process tile " + tileName + ": " + e.message;
  }

  done(null, { 
    // Here we are sending all the data that we need to write in our different output files
    type: refRoadType,
    diffs: refDeltas,
    buffers: streetBuffers,
    refs: refRoads,
    osm: osmData,
    stats: { 
      total: refRoadsLength,
      diff: diffRoadsLength,
      count: refRoadsCount
    },
    error: errorMessage
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

function filter(road, refRoadType) {
  // permits us to filter the streets that are too small to be processed
  // if you want to add the linestring then you need to add refRoadType as a second argument for this function and uncomment the if + else statement

  if(refRoadType === "Polygon" || refRoadType === "MultiPolygon"){
    var area = turf.area(road, 'kilometers');
    if(area < 30) {
      return true;
    } else {
      return false;
    }
  }
  else {
    return false;
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
      /* This process permits to hash strings we don't use it there because we wanted to have a more reliable hashing function
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

// CompareByTags permits us to see if two tags are different, if they're different then we return true
function CompareByTags(refTag, sourceTag) {
  if(refTag !== sourceTag) return true;
  else return false;
}

// CompareByTag permits us to see if one tag has a "yes" value in the feature we're processing
function CompareByTag(refTag) {
  if(refTag === "yes") return true;
  else return false;
}

// CompareCobblestone permits us to see if one feature has a cobblestone value in the feature we're processing
function CompareCobblestone(refTag) {
  if (refTag === "sett" || refTag === "unhewn_cobblestone" || refTag === "cobblestone") return true;
  else return false;
}

// The two next functions are customized exceptions, it permits us to immediately know from where the error comes from
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