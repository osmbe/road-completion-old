#!/bin/bash

file="$(pwd)/host-share"

rm -rf $file/*

# gets data for osm and urbis, cuts out brussels for osm
echo "Running data tool:"
cd data-tool
sudo docker run -v $file:/sharedfolder road-completion-getdata
sudo docker run -v /home/antoine/road-completion/docker/host-share:/sharedfolder road-completion-getdata

echo "Running tag process:"
cd ../tagprocess
sudo docker run -v $file:/sharedfolder road-completion-tagprocess

# convert data from osm and urbis to comparable mbtiles
echo "Running tag conversion:"
cd ../convert
sudo docker run -v $file:/sharedfolder road-completion-convert

# starts index.js for the converted mbtiles
echo "Running difference tool:"
cd ../difference
sudo docker run -v $file:/usr/src/app/sharedfolder road-completion-difference

# convert to data usable by the frontend
# when output.geosjon is not found, the convert script does not run, now it is generated so it will run
echo "Preparing output:"
cd ../mb-util
sudo docker run -v $file:/sharedfolder road-completion-convert
sudo docker run -v $file:/sharedfolder road-completion-mbutil
