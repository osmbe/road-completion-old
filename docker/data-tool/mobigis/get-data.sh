#!/bin/bash

file="mobigis-cobblestone"
url="http://data-mobility.irisnet.be/geoserver/bm_bike/wfs?service=wfs&version=1.1.0&request=GetFeature&typeName=bm_bike:bike_paves_ss&outputFormat=shape-zip"
cobblestone_file="bike_paves_ss"
output="mobigis"
# Download mobigis cobblestone data
wget -O $file $url

unzip $file

if [ ! -f ./$output.geojson ]; then
ogr2ogr --config SHAPE_ENCODING "ISO-8859-1" -f "GeoJSON" -s_srs "EPSG:31370" -t_srs "EPSG:4326" -progress $output.geojson $cobblestone_file.shp
fi

cp $output.geojson ../../../sharedfolder
rm $output*
rm "bike"*
