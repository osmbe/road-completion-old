urbis="UrbAdm_COMBINED"
urbislength="UrbAdm_STREET_ROADS_LENGTH"
node index.js sharedfolder/brussels.mbtiles sharedfolder/$urbis.mbtiles sharedfolder/output.geojson
node index.js sharedfolder/brussels.mbtiles sharedfolder/$urbislength.mbtiles sharedfolder/urbis-streets-output.geojson sharedfolder/urbis-streets-stats.json
node index.js sharedfolder/flanders.mbtiles sharedfolder/wegenregister.mbtiles sharedfolder/wegenregister-output.geojson sharedfolder/wegenregsiter-stats.json
