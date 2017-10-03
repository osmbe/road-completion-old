#!/bin/sh

cd ~

sudo apt-get install -y build-essential libsqlite3-dev zlib1g-dev

# https://github.com/mapbox/tippecanoe#development

wget https://github.com/mapbox/tippecanoe/archive/1.16.11.tar.gz
tar -xvf 1.16.11.tar.gz

cd tippecanoe-1.16.11
make && sudo make install
