// This is the modified version of the process.js file
// process.js converts from wegenregister to OSM tags
// this one converts from urbis to OSM tags

var geojsonTransform = require("./geojson-transform");

var args = process.argv.slice(2);

var opts = {
  source: args[0], 
  target: args[1], 
};

// TO DO: Process Urbis data and then add the cobblestone tags from mobigis data
// this script should change depending on the number of arguments for example:
/*
    var opts = {};
    if (args.length == 2)
    {
        opts = {
            source: args[0],
            target: args[1],
        };
    }
    if (args.length == 3)
    {
        opts = {
            source: args[0],
            mobigis: args[1],
            target: args[2],
        };
    }
*/
// So if we get 2 arguments (urbis data and output) we just convert the tags
// And if we get 3 arguments (urbis data, mobigis cobblestone data and output) we convert urbis tags to osm tags and then add the converted mobigis tags
/*
    if(p.pave == 1)
    {
        transformed.surface = 'sett';
    }
*/

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
    // TYPE GB: parks
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
        if (p.TYPE == 'GB')
        {
            transformed.highway = "unclassified";
            transformed.leisure = "park";
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