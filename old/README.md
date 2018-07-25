# Road completion project

These are a collection of tools & scripts to compare road datasets between OSM and external sources. This is based on some stuff mapbox started, <https://www.mapbox.com/blog/osm-qa-tiles/>, and uses their QA tile-based stuff to compare government road datasets to OpenStreetMap. 

It uses the following tools:

- GDAL: to convert shapefiles from local project to WGS84.
- [tippecanoe](https://github.com/mapbox/tippecanoe): a tool from Mapbox to generate vector tiles.
- [tilereduce](https://github.com/mapbox/tile-reduce): another tool from Mapbox (thanks!) to run analysis on the tile data itself.

To produce the following effect:

![Awesome gif here!](/docs/tile-example/comparison.gif)

## Install

```
git clone https://github.com/osmbe/road-completion.git

cd road-completion

sh install/install-dependencies.sh
sh install/install-gdal.sh
sh install/install-tippecanoe.sh
```

```
npm install
```

## Run comparison

### OSM data

To start you need to download and setup the OSM source data. To do this run:

```
cd ./sources/osm/
./get-data.sh
```

This downloads Belgium, converts it to GeoJSON keeping the roads only and packages the results into an MBTILES file.

### Reference data

To run the comparison you also need to download and convert a reference dataset. Scripts to do this can be found in the ´´´sources´´´ folder. Let's start with _wegenregister_:

```
cd ./sources/wegenregister/
./get-data.sh
```

This downloads a shapefile, converts it to GeoJSON, converts the attributes to OSM-tags and packages the result into an MBTILES file.

### Compare

```
node index.js ./sources/osm/belgium.mbtiles ./sources/wegenregister/wegenregister.mbtiles output.geojson
```

This runs the comparison process on the OSM data using wegenregister as a reference. The output is written to _output.geojson_ in this case.
