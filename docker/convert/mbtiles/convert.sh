#!/bin/bash
file="/sharedfolder/output.geojson"
if [ -f "$file" ]
then
    tippecanoe -o /sharedfolder/diffs.mbtiles -l diffs -n "Diffs layer" -z14 /sharedfolder/output.geojson
    #mb-util --image_format=pbf /sharedfolder/diffs.mbtiles /sharedfolder/diffs-tiles
else
    echo "$file not found."
fi

