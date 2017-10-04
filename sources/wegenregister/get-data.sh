#!/bin/sh
# this downloads and converts the wegenregister data to a format that can be used by tippecanoe and tile-reduce.

# https://overheid.vlaanderen.be/wegenregister-stand-van-zaken
# https://download.agiv.be/Producten/Detail?id=3810&title=Wegenregister_22_06_2017
# get wegenregister if not present
# IMPORTANT: it's possible the URL just changes, horrible right? nothing we can do about it.
if [ ! -d ./Wegenregister_SHAPE_20170921 ]; then
    wget -O ./Wegenregister_SHAPE_20170921.zip https://downloadagiv.blob.core.windows.net/wegenregister/Wegenregister_SHAPE_20170921.zip
    unzip ./Wegenregister_SHAPE_20170921.zip -d ./
fi

#convert wegenregister to geojson
if [ ! -f ./wegsegment.geojson ]; then
    ogr2ogr --config SHAPE_ENCODING "ISO-8859-1" -f "GeoJSON" -s_srs "EPSG:31370" -t_srs "EPSG:4326" -progress ./wegsegment.geojson ./Wegenregister_SHAPE_20170921/Shapefile/Wegsegment.shp
fi

#convert to OSM-tags
node process.js ./wegsegment.geojson ./wegsegment-transformed.geojson

#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
tippecanoe -f -o ./wegenregister.mbtiles ./wegsegment-transformed.geojson -l ref -pf -pk