#!/bin/sh
[ -d ./data ] || mkdir ./data

# http://osmlab.github.io/osm-qa-tiles/country.html
#wget -O ./data/belgium.mbtiles.gz https://s3.amazonaws.com/mapbox/osm-qa-tiles/latest.country/belgium.mbtiles.gz
#gunzip ./data/belgium.mbtiles.gz

# https://overheid.vlaanderen.be/wegenregister-stand-van-zaken
# https://download.agiv.be/Producten/Detail?id=3742&title=Wegenregister_23_03_2017
#wget -O ./data/Wegenregister_SHAPE_20170323.zip https://downloadagiv.blob.core.windows.net/wegenregister/Wegenregister_SHAPE_20170323.zip
#unzip ./data/Wegenregister_SHAPE_20170323.zip -d ./data

ogr2ogr --config SHAPE_ENCODING "ISO-8859-1" -f "GeoJSON" -s_srs "EPSG:31370" -t_srs "EPSG:4326" -progress ./data/wegsegment.geojson ./data/Wegenregister_SHAPE_20170323/Shapefile/Wegsegment.shp

tippecanoe -o ./data/wegenregister.mbtiles ./data/wegsegment.geojson
