var geojsonTransform = require("./geojson-transform");

var args = process.argv.slice(2);

var opts = {
  source: args[0], 
  target: args[1], 
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

    if (p.TYPE)
    {
        if (p.TYPE == 'K')
        {
            transformed.service = "parking_aisle";
            transformed.highway = "unclassified";
            console.log('Added parking aisle');
        }
        if (p.TYPE == 'B')
        {
            transformed.bridge = 'yes';
            transformed.highway = "unclassified";
            console.log('Added bridge');
        }
        if (p.TYPE == 'T')
        {
            transformed.tunnel = 'yes';
            transformed.highway = "unclassified";
            console.log('Added tunnel');
        }
        if (p.TYPE == 'S' || p.TYPE == 'I' || p.TYPE == 'W')
        {
            if (transformed.highway != "unclassified")
            transformed.highway = "unclassified";
        }
    }

    /*if (p.PN_NAME_FR && p.PN_NAME_FR != 'Inconnu')
    {
        transformed.other_tags["name"]["fr"] = p.PN_NAME_FR;
    }

    if (p.PN_NAME_DU && p.PN_NAME_DU != 'Ongekend')
    {
        transformed.other_tags["name"]["nl"] = p.PN_NAME_DU;
    }*/

    if (p.PN_NAME_FR && p.PN_NAME_DU) 
    {
        if (p.PN_NAME_DU != 'Ongekend' && p.PN_NAME_FR != 'Inconnu')
        {

            if (p.PN_NAME_FR == p.PN_NAME_DU) 
            {
                transformed.name = p.PN_NAME_FR;
            }

            transformed.name = p.PN_NAME_FR + " - " + p.PN_NAME_DU;
        }
    }

    transformed.source = "urbis";

    if (transformed.highway) 
    {
        return transformed;
    }
    return undefined;
});