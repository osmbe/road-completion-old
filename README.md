# Road completion project

This is based on some stuff mapbox started: <https://www.mapbox.com/blog/osm-qa-tiles/>

## Install

```
git clone https://github.com/osmbe/road-completion.git

cd road-completion

sh scripts/install-dependencies.sh
sh scripts/install-gdal.sh
sh scripts/install-tippecanoe.sh
```

Updated npm packages and run the _get-data_ that does a couple of things:

- Downloads OSM-data for Belgium.
- Splits this into vector tiles using [tippecanoe](https://github.com/mapbox/tippecanoe): belgium.mbtiles
- Donwloads road data from the flemish government called 'wegenregister'.
- Splits this also into vector tiles: wegenregister.mbtiles

```
npm install
npm run get-data
```

## Run

```
node index.js
```
