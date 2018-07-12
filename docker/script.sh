<<<<<<< HEAD
#file="/root/road-completion/docker/host-share"
=======
>>>>>>> 81848dc30687b8fd1d768233726f8af7c1f8dd54
file="$(pwd)/host-share"

rm -f $file/output.geojson
rm -f $file/brussels.mbtiles
rm -f $file/wegenregister.mbtiles
rm -f $file/brussels.geojson
rm -f $file/wegsegment.geojson
rm -f $file/diffs.mbtiles
rm -rf $file/diffs-tiles

# gets data for osm and urbis, cuts out brussels for osm
cd data-tool
sudo docker build -t road-completion-getdata .
sudo docker run -v $file:/sharedfolder road-completion-getdata

# convert data from osm and urbis to comparable mbtiles
cd ../convert
sudo docker build -t road-completion-convert .
sudo docker run -v $file:/sharedfolder road-completion-convert

# starts index.js for the converted mbtiles
cd ../difference
sudo docker build -t road-completion-difference .
sudo docker run -v $file:/usr/src/app/sharedfolder road-completion-difference

# convert to data usable by the frontend
# when output.geosjon is not found, the convert script does not run, now it is generated so it will run
cd ../mb-util
sudo docker run -v $file:/sharedfolder road-completion-convert
sudo docker build -t road-completion-mbutil .
sudo docker run -v $file:/sharedfolder road-completion-mbutil
