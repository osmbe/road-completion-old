#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
urbis="UrbAdm_STREET_AXIS"
sudo tippecanoe -f -o /sharedfolder/$urbis.mbtiles /sharedfolder/$urbis.geojson -l roads -pf -pk

