var geojsonTransform = require("../../geojson-transform");

var opts = {
  source: "C:\\work\\osmbe\\road-completion-data\\wegenregister.geojson",
  target: "C:\\work\\osmbe\\road-completion-data\\wegenregister-transformed.geojson"
};

geojsonTransform.transform(opts.source, opts.target, function(p) {
    if (p.STATUS != 4) {
        return undefined;
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