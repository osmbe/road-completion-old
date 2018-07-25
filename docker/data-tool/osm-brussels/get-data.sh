#!/bin/sh
# this downloads and converts OSM data to a format that can be used by tippecanoe and tile-reduce.

#get data for belgium
wget http://files.itinero.tech/data/OSM/planet/europe/belgium-latest.osm.pbf  -O ./belgium-latest.osm.pbf

#pbf from osm: take only brussels
osmosis --read-pbf ./belgium-latest.osm.pbf --bounding-box left=4.23248291015625 top=50.92467892226281 right=4.513320922851562 bottom=50.75904732375726 --write-pbf ./brussels-latest-bbox.osm.pbf
osmosis --read-pbf ./brussels-latest-bbox.osm.pbf --bounding-polygon file=brussels.poly --write-pbf ./brussels-latest.osm.pbf

#convert to geojson while taking only highways.
ogr2ogr --config OSM_CONFIG_FILE osmconf.ini -f GeoJSON -select name,highway,bridge,tunnel,surface -where "highway is not null and highway not in ('footway', 'steps', 'cycleway', 'pedestrian', 'bridleway', 'construction', 'corridor', 'path', 'platform')" -nln osm_highways -progress  brussels.geojson brussels-latest.osm.pbf lines

cp brussels.geojson ../../sharedfolder

#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
#tippecanoe -o ./brussels.mbtiles ./brussels.geojson -l roads -f -pf -pk
