#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
tippecanoe -o /sharedfolder/brussels.mbtiles /sharedfolder/brussels.geojson -l roads -f -pf -pk
