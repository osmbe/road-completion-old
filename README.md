# Road completion project

This is based on some stuff mapbox started, <https://www.mapbox.com/blog/osm-qa-tiles/>, and uses their QA tile-based stuff to compare government road datasets to OpenStreetMap. 

It uses the following tools:

- GDAL: to convert shapefiles from local project to WGS84.
- [tippecanoe](https://github.com/mapbox/tippecanoe): a tool from Mapbox to generate vector tiles.
- [tilereduce](https://github.com/mapbox/tile-reduce): another tool from Mapbox (thanks!) to run analysis on the tile data itself.

## Install

```
git clone https://github.com/osmbe/road-completion.git

cd road-completion

sh scripts/install-dependencies.sh
sh scripts/install-gdal.sh
sh scripts/install-tippecanoe.sh
```

Updates npm packages and run the _get-data_ that does a couple of things:

- Downloads OSM-data for Antwerp.
- Splits this into vector tiles using [tippecanoe](https://github.com/mapbox/tippecanoe): antwerp.mbtiles
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
