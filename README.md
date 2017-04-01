# Road completion project

This is based on some stuff mapbox started: <https://www.mapbox.com/blog/osm-qa-tiles/>

## Install

```
git clone git@github.com:osmbe/road-completion.git

cd road-completion

sh scripts/install-dependencies.sh
sh scripts/install-gdal.sh
sh scripts/install-tippecanoe.sh

npm install
npm run get-data
```

## Run

```
node index.js
```