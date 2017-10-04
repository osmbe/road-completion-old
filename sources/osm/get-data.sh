#!/bin/sh
# this downloads and converts OSM data to a format that can be used by tippecanoe and tile-reduce.

#get data for belgium
wget http://download.geofabrik.de/europe/belgium-latest.osm.pbf  -O ./belgium-latest.osm.pbf

#convert to geojson while taking only highways.
ogr2ogr -f GeoJSON -select name,highway -where "highway is not null"  -nln osm_highways -progress  belgium.geojson  belgium-latest.osm.pbf  lines

#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
tippecanoe -o ./belgium.mbtiles ./belgium.geojson -l roads -f -pf -pk