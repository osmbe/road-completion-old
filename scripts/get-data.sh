#!/bin/sh
[ -d ./data ] || mkdir ./data

# http://osmlab.github.io/osm-qa-tiles/country.html > changed to get antwerp
# wget -O ./data/belgium.mbtiles.gz https://s3.amazonaws.com/mapbox/osm-qa-tiles/latest.country/belgium.mbtiles.gz
# gunzip ./data/belgium.mbtiles.gz

#get data for antwerp: https://mapzen.com/data/metro-extracts/metro/antwerp_belgium/
wget https://s3.amazonaws.com/metro-extracts.mapzen.com/antwerp_belgium.osm.pbf  -O ./data/antwerp_belgium.osm.pbf

#convert to geojson
ogr2ogr -f GeoJSON -select name,highway -where "highway is not null AND highway NOT IN ( 'pedestrian', 'cycleway', 'path')"  -nln osm_highways -progress  data/antwerp.geojson  data/antwerp_belgium.osm.pbf  lines

# https://overheid.vlaanderen.be/wegenregister-stand-van-zaken
# https://download.agiv.be/Producten/Detail?id=3810&title=Wegenregister_22_06_2017
# get wegenregister if not present
if [ ! -d ./data/Wegenregister_SHAPE_20170622 ]; then
    wget -O ./data/Wegenregister_SHAPE_20170622.zip https://downloadagiv.blob.core.windows.net/wegenregister/Wegenregister_SHAPE_20170622.zip
    unzip ./data/Wegenregister_SHAPE_20170622.zip -d ./data
fi

#convert wegenregister to geojson
if [ ! -f ./data/wegsegment.geojson ]; then
    ogr2ogr --config SHAPE_ENCODING "ISO-8859-1" -spat 139205 203546 159127 230093 -f "GeoJSON" -s_srs "EPSG:31370" -t_srs "EPSG:4326" -progress ./data/wegsegment.geojson ./data/Wegenregister_SHAPE_20170622/Shapefile/Wegsegment.shp
fi

#convert to vectortiles, don't redo wegsegment if already exists
[ -f ./data/wegenregister.mbtiles ] || tippecanoe -z10 -f --drop-densest-as-needed  -o ./data/wegenregister.mbtiles ./data/wegsegment.geojson
tippecanoe -z10 -f --drop-densest-as-needed -o ./data/antwerp.mbtiles ./data/antwerp.geojson
