var geojsonTransform = require("../../geojson-transform");

var args = process.argv.slice(2);

var opts = {
  source: args[0], // "../../data/wegsegment.geojson",
  target: args[1], //"../../data/wegsegment-transformed.geojson"
};

var i = 0;
geojsonTransform.transform(opts.source, opts.target, function(p) {
    if (p.STATUS != 4) {
        return undefined;
    }

    i++;
    if (i % 1000 == 0){
        console.log("Processed " + i + " linestrings...");
    }

    if (p.WEGCAT == 'H') {
        return {
            highway: "motorway"
        };
    } else if (p.WEGCAT == 'L' ||
        p.WEGCAT == 'L1' ||
        p.WEGCAT == 'L2' ||
        p.WEGCAT == 'L3') {
        return {
            highway: "residential"
        };
    }
    return undefined;
});