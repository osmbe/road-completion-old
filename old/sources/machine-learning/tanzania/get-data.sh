#convert to OSM-tags
node process.js ./roads.geojson ./roads-transformed.geojson

#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
tippecanoe -f -o ./roads.mbtiles ./roads-transformed.geojson -l roads -pf -pk