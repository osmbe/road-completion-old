var geojsonStream = require("geojson-stream"),
 fs = require('fs');

module.exports.transform = function(source, target, transform) {
    var sourceStream = fs.createReadStream(source);
    var targetStream = fs.createWriteStream(target);
    var parser = geojsonStream.parse();
    var writer = geojsonStream.stringify();
    writer.pipe(targetStream);
    
    parser.on('data', function(data) {
        var transformed = transform(data.properties);

        if (transformed) {
            data.properties = transformed;
            writer.write(data);
        }
    }).on('end', function() {
        writer.end();
    });
    
    sourceStream.pipe(parser);
};