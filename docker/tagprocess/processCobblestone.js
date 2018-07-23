// This is the modified version of the process.js file
// the original process.js converts from wegenregister to OSM tags
// this one checks both coordinates and sets the surface to sett

var geojsonTransform = require("./geojson-transform");

var args = process.argv.slice(2);

var opts = {
  source: args[0], 
  target: args[1], 
};

var i = 0;
geojsonTransform.transform(opts.source, opts.target, function(p) {

    var transformed = {};
    for (var property in p) 
    {
        if (p.hasOwnProperty(property)) 
        {
            transformed["orginal:" + property] = p[property];
        }
    }

    i++;
    if (i % 1000 == 0)
    {
        // This is just to have some feedback, you know, tell the user that the code is actually doing something
        console.log("Processed " + i + " linestrings...");
    }

    // if coordinates are ==, then the surface is cobblestone
    if (p.coordinates == transformed.coordinates)
    {
        transformed.surface = 'sett';
        transformed.highway = 'unclassified';
    }

    // We add the source
    transformed.source = "mobigis";

    if (transformed.highway) 
    {
        return transformed;
    }
    return undefined;
});