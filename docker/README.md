# Road completion project - Dockerized

The Belgian OpenStreetMap community is building tools to make sure that any correction in the official open data road sets is made visible to the mapping community as quickly and as accurately as possible.

The live version of the tool is visible on https://road-completion.osm.be .

The road-completion tool uses open data from [Urbis](https://cibg.brussels/nl/onze-oplossingen/urbis-solutions/urbis-data) to compare to OpenStreetMap. After comparing, the tool will visualize all issues that need to be checked by te OSM community.

For processing and comparing the data the following tools are used:

- GDAL: to convert shapefiles from local project to WGS84.
- [tippecanoe](https://github.com/mapbox/tippecanoe): a tool from Mapbox to generate vector tiles.
- [tilereduce](https://github.com/mapbox/tile-reduce): another tool from Mapbox (thanks!) to run analysis on the tile data itself

To achive maximum compatibility the scripts are dockerized. 

## Install

Make sure docker is installed on the machine.

```
git clone https://github.com/osmbe/road-completion.git

cd road-completion/docker

# the first time you will need to run the build script
# this will build the docker containers and copy all the needed files
sudo sh build.sh

# when the docker containers have been build, you can use this script to run them.
sudo sh run.sh
```
make sure when running the scripts you are in the `road-completion/docker` folder and not in any of the sub directories.

## Results

Running the docker containers can take a while. When the process is done all the results are in the host-share folder at `road-completion/docker/host-share`.

Explanation of the created files:
- **brussels.geojson**
    - Contains openstreetmap data from Brussels
- **UrbAdm_STREET_AXIS.geojson**
    - Contains the surface level of the map (Urbis)
- **UrbAdm_STREET_SURFACE_LEVEL_PLUS1.geojson**
    - Contains bridges (Urbis)
- **UrbAdm_STREET_SURFACE_LEVEL_MINUS1.geojson**
    - Contains tunnels (Urbis)
- **UrbAdm_STREET_ROADS_LENGTH.geojson**
    - Contains street lines (Urbis)
- **mobigis.geojson**
    - Contains cobblestone data

- **UrbAdm_COMBINED.geojson**
    - Downloaded data files combined + translated to OSM tags

- **Converted geojson files to mbtiles for the difference script**
    - brussels.mbtiles  
    - UrbAdm_COMBINED.mbtiles
    - UrbAdm_STREET_ROADS_LENGTH.mbtiles

- **output.geojson**
    - Contains all the differences between urbis and OSM
- **diffs.mbtiles**
    - all differences in an mbtiles file. (for converting to folder)
- **diffs-tiles**
    - Folder that contains a pbf file for each tile
    - This gets called in the frontend

## Publishing

Mapbox GL JS pulls the diffs-tiles from the server in a certain way that requires some configuration. 
For the configuration of the server [NGINX](https://www.nginx.com) was used together with [CertBot](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04) for https.

The configuration of the route for the diffs-tiles:
```
location /vector-tiles/ {
    add_header 'content-encoding' 'gzip';
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    root /var/www/;
    try_files $uri =200;
}
```

- `'content-encoding' 'gzip'`: Gzip compressing is used because of the way mapbox decodes the data.
- `'Access-Control-Allow-Origin' '*' always`: To allow any resource to access your resource.
- `'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always`: Specifies the methods allowed when accessing the resource in response to a preflight request.
- `try_files $uri =200`: Mapbox throws exceptions when tiles are not found. This makes it unpredictable because not all tiles contain issues. To fix this we always set the return code to 200.
``
