#!/bin/sh

cd ~

sudo apt-get install -y build-essential libproj-dev

# https://trac.osgeo.org/gdal/wiki/DownloadSource
wget http://download.osgeo.org/gdal/2.2.1/gdal-2.2.1.tar.gz
tar -xvf gdal-2.2.1.tar.gz
rm gdal-2.2.1.tar.gz

# https://trac.osgeo.org/gdal/wiki/BuildingOnUnix
# CONFIGURE HELP : ./configure --help

cd gdal-2.2.1
./configure && make && sudo make install

export PATH=/usr/local/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
export GDAL_DATA=/usr/local/share/gdal

