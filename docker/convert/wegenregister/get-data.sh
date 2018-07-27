#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
sudo tippecanoe -f -o /sharedfolder/wegenregister.mbtiles /sharedfolder/wegenregister-transformed.geojson -l roads -pf -pk