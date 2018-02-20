// import { tag } from "@turf/turf";

var geojsonTransform = require("../../../geojson-transform");

var args = process.argv.slice(2);

var opts = {
  source: args[0], // "../../data/wegsegment.geojson",
  target: args[1], //"../../data/wegsegment-transformed.geojson"
};

var i = 0;
geojsonTransform.transform(opts.source, opts.target, function(p) {

    var transformed = {};
    for (var property in p) {
        if (p.hasOwnProperty(property)) {
            transformed["orginal:" + property] = p[property];
        }
    }

    i++;
    if (i % 1000 == 0){
        console.log("Processed " + i + " linestrings...");
    }

    transformed.highway = "unclassified";

    transformed.source = "machinelearning/tanzania";

    if (transformed.highway) {
        return transformed;
    }
    return undefined;
});