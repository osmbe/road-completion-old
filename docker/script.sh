#!/bin/bash

file="$(pwd)/host-share"

rm -rf $file/*

# gets data for osm and urbis, cuts out brussels for osm
cd data-tool
sudo docker build -t road-completion-getdata .
sudo docker run -v $file:/sharedfolder road-completion-getdata


cd ../tagprocess
sudo docker build -t road-completion-tagprocess .
sudo docker run -v $file:/sharedfolder road-completion-tagprocess

# convert data from osm and urbis to comparable mbtiles
cd ../convert
sudo docker build -t road-completion-convert .
sudo docker run -v $file:/sharedfolder road-completion-convert

# starts index.js for the converted mbtiles
cd ../difference
sudo docker build -t road-completion-difference .
sudo docker run -v $file:/usr/src/app/sharedfolder road-completion-difference

# convert to data usable by the frontend
# when output.geosjon is not found, the convert script does not run, now it is generated so it will run
cd ../mb-util
sudo docker run -v $file:/sharedfolder road-completion-convert
sudo docker build -t road-completion-mbutil .
sudo docker run -v $file:/sharedfolder road-completion-mbutil
