#!/bin/sh
# this downloads and converts OSM data to a format that can be used by tippecanoe and tile-reduce.

#get raw OSM data
wget http://download.geofabrik.de/africa/tanzania-latest.osm.pbf  -O ./tanzania-latest.osm.pbf

#convert to geojson while taking only highways.
ogr2ogr -f GeoJSON -select name,highway -where "highway is not null"  -nln osm_highways -progress  tanzania.geojson  tanzania-latest.osm.pbf  lines

#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
tippecanoe -o ./tanzania.mbtiles ./tanzania.geojson -l roads -f -pf -pk