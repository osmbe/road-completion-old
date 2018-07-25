#!/bin/sh
# this uses tippecanoe to build mbtiles.

tippecanoe -o ./diffs.mbtiles -l diffs -n "Diffs layer" -z14 ./diffs.geojson