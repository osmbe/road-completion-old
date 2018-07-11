#!/bin/bash
file="/sharedfolder/diffs.mbtiles"
if [ -f "$file" ]
then
mb-util --image_format=pbf /sharedfolder/diffs.mbtiles /sharedfolder/diffs-tiles
else
echo "$file not found."
fi


