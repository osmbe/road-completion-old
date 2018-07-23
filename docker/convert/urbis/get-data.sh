#convert to vectortiles
# TODO: test with zoom-level limits, we only need level 14.
urbis="UrbAdm_COMBINED"
urbislength="UrbAdm_STREET_ROADS_LENGTH"
sudo tippecanoe -f -o /sharedfolder/$urbis.mbtiles /sharedfolder/$urbis.geojson -l roads -pf -pk
sudo tippecanoe -f -o /sharedfolder/$urbislength.mbtiles /sharedfolder/$urbislength.geojson -l roads -pf -pk

