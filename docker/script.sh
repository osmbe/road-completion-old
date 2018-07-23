#!/bin/bash

file="$(pwd)/host-share"

combined="UrbAdm_COMBINED.geojson"
level_plus1="UrbAdm_STREET_SURFACE_LEVEL_PLUS1.geojson"
level_minus1="UrbAdm_STREET_SURFACE_LEVEL_MINUS1.geojson"
level0="UrbAdm_STREET_AXIS.geojson"
output="UrbAdm_STREET_TAGS.geojson"

level_plus1_output="UrbAdm_STREET_SURFACE_LEVEL_PLUS1_TAGS.geojson"
level_minus1_output="UrbAdm_STREET_SURFACE_LEVEL_MINUS1_TAGS.geojson"
level0_output="UrbAdm_STREET_AXIS_TAGS.geojson"

rm -f $file/output.geojson
rm -f $file/brussels.mbtiles
rm -f $file/UrbAdm_STREET_AXIS.mbtiles
rm -f $file/brussels.geojson
rm -f $file/UrbAdm_STREET_AXIS.geojson
rm -f $file/diffs.mbtiles
rm -f $file/diffs-tiles
rm -f $file/$combined
rm -f $file/$level_plus1
rm -f $file/$level_minus1
rm -f $file/UrbAdm_COMBINED.mbtiles
rm -f $file/UrbAdm_STREET_ROADS_LENGTH.geojson
rm -f $file/UrbAdm_STREET_ROADS_LENGTH.mbtiles
rm -f $file/$level0
rm -f $file/$output
rm -f $file/$level_plus1_output
rm -f $file/$level_minus1_output
rm -f $file/$level0_output
rm -f $file/nointerest.geojson
rm -f $file/stats.geojson

# gets data for osm and urbis, cuts out brussels for osm
cd data-tool
sudo docker build -t road-completion-getdata .
sudo docker run -v $file:/sharedfolder road-completion-getdata


cd ../tagprocess
sudo docker build -t road-completion-tagprocess .
sudo docker run -v $file:/sharedfolder road-completion-tagprocess

#convert data from osm and urbis to comparable mbtiles
cd ../convert
sudo docker build -t road-completion-convert .
sudo docker run -v $file:/sharedfolder road-completion-convert

# starts index.js for the converted mbtiles
cd difference
sudo docker build -t road-completion-difference .
sudo docker run -v $file:/usr/src/app/sharedfolder road-completion-difference

# convert to data usable by the frontend
# when output.geosjon is not found, the convert script does not run, now it is generated so it will run
cd ../mb-util
sudo docker run -v $file:/sharedfolder road-completion-convert
sudo docker build -t road-completion-mbutil .
sudo docker run -v $file:/sharedfolder road-completion-mbutil
