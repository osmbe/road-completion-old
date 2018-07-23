// This is the modified version of the process.js file
// process.js converts from wegenregister to OSM tags
// this one converts from urbis to OSM tags

var geojsonTransform = require("./geojson-transform");

var args = process.argv.slice(2);

var opts = {
  source: args[0], 
  target: args[1], 
};
transformed.name = p.PN_NAME_FR + " - " + p.PN_NAME_DU;

var i = 0;
geojsonTransform.transform(opts.source, opts.target, (p) => {

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

    // Check if the "TYPE" property exists
    // These are the different urbis types I found the most useful (that have an OSM tag equivalent)
    // TYPE K: parking aisles
    // TYPE B: bridges
    // TYPE T: tunnels
    // TYPE S, I, W: road types (just unclassified highway in OSM)
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

    // I had to comment this part out because I couldn't seem to access the fr and nl name inside of "other_tags"
    /*if (p.PN_NAME_FR && p.PN_NAME_FR != 'Inconnu')
    {
        transformed.other_tags["name"]["fr"] = p.PN_NAME_FR;
    }

    if (p.PN_NAME_DU && p.PN_NAME_DU != 'Ongekend')
    {
        transformed.other_tags["name"]["nl"] = p.PN_NAME_DU;
    }*/

    // Check if the name (FR or NL) property exists
    if (p.PN_NAME_FR && p.PN_NAME_DU) 
    {
        // We don't want to convert to osm tags if the name appears as "unknown"
        if (p.PN_NAME_DU != 'Ongekend' && p.PN_NAME_FR != 'Inconnu')
        {
            // If the FR and NL tags are the same value, we just add one name
            if (p.PN_NAME_FR == p.PN_NAME_DU) 
            {
                transformed.name = p.PN_NAME_FR;
            }
            // else we add both names
            else
            {
                transformed.name = p.PN_NAME_FR + " - " + p.PN_NAME_DU;
            } 
        }
    }

    // We check if the postal code property exists inside of Urbis
    if (p.PZ_NAT_COD)
    {
        transformed.postal_code = p.PZ_NAT_COD;
    }

    // We add the source
    transformed.source = "urbis";

    if (transformed.highway) 
    {
        return transformed;
    }
    return undefined;
});