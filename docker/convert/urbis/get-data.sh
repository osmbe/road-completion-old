#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
tippecanoe -f -o /sharedfolder/wegenregister.mbtiles /sharedfolder/wegsegment.geojson -l roads -pf -pk
