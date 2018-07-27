#!/bin/sh
# this downloads and converts OSM data to a format that can be used by tippecanoe and tile-reduce.

#get data for belgium
wget http://files.itinero.tech/data/OSM/planet/europe/belgium-latest.osm.pbf  -O ./belgium-latest.osm.pbf

#pbf from osm: take only brussels
# belgium -> flanders bbox
osmosis --read-pbf ./belgium-latest.osm.pbf --bounding-box left=2.2467041015625 top=51.5429188223739 right=5.899658203125 bottom=50.64249394010323 --write-pbf ./flanders-latest-bbox.osm.pbf
# flanders bbox -> brussels bbox
osmosis --read-pbf ./flanders-latest-bbox.osm.pbf --bounding-box left=4.23248291015625 top=50.92467892226281 right=4.513320922851562 bottom=50.75904732375726 --write-pbf ./brussels-latest-bbox.osm.pbf
# brussel bbox -> brussels poly
osmosis --read-pbf ./brussels-latest-bbox.osm.pbf --bounding-polygon file=brussels.poly --write-pbf ./brussels-latest.osm.pbf
# flanders bbox -> flanders poly
osmosis --read-pbf ./flanders-latest-bbox.osm.pbf --bounding-polygon file=flanders.poly --write-pbf ./flanders-latest.osm.pbf

# brussels: convert to geojson while taking only highways.
ogr2ogr --config OSM_CONFIG_FILE osmconf.ini -f GeoJSON -select name,highway,bridge,tunnel,surface -where "highway is not null" -nln osm_highways -progress  brussels.geojson brussels-latest.osm.pbf lines
#ogr2ogr --config OSM_CONFIG_FILE osmconf.ini -f GeoJSON -select name,highway,bridge,tunnel,surface -where "highway is not null and highway not in ('footway', 'steps', 'cycleway', 'pedestrian', 'bridleway', 'construction', 'corridor', 'path', 'platform')" -nln osm_highways -progress  brussels.geojson brussels-latest.osm.pbf lines

# flanders: convert to geojson while taking only highways.
ogr2ogr --config OSM_CONFIG_FILE osmconf.ini -f GeoJSON -select name,highway,bridge,tunnel,surface -where "highway is not null" -nln osm_highways -progress  flanders.geojson flanders-latest.osm.pbf lines

# copy results.
cp brussels.geojson ../../sharedfolder
cp flanders.geojson ../../sharedfolder
