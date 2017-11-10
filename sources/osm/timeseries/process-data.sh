if [ ! -f ./jaar2007.geojson ]; then
  unzip ./jaar2007.geojson.gz
fi
if [ ! -f ./jaar2008.geojson ]; then
  unzip ./jaar2008.geojson.gz
fi
if [ ! -f ./jaar2009.geojson ]; then
  unzip ./jaar2009.geojson.gz
fi
if [ ! -f ./jaar2010.geojson ]; then
  unzip ./jaar2010.geojson.gz
fi
if [ ! -f ./jaar2011.geojson ]; then
  unzip ./jaar2011.geojson.gz
fi
if [ ! -f ./jaar2012.geojson ]; then
  unzip ./jaar2012.geojson.gz
fi
if [ ! -f ./jaar2013.geojson ]; then
  unzip ./jaar2013.geojson.gz
fi
if [ ! -f ./jaar2014.geojson ]; then
  unzip ./jaar2014.geojson.gz
fi
if [ ! -f ./jaar2015.geojson ]; then
  unzip ./jaar2015.geojson.gz
fi
if [ ! -f ./jaar2015.geojson ]; then
  unzip ./jaar2015.geojson.gz
fi
if [ ! -f ./jaar2016.geojson ]; then
  unzip ./jaar2016.geojson.gz
fi
if [ ! -f ./jaar2017.geojson ]; then
  unzip ./jaar2017.geojson.gz
fi


tippecanoe -o ./flanders-year-2007.mbtiles ./jaar-2007.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2008.mbtiles ./jaar-2008.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2009.mbtiles ./jaar-2009.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2010.mbtiles ./jaar-2010.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2011.mbtiles ./jaar-2011.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2012.mbtiles ./jaar-2012.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2013.mbtiles ./jaar-2013.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2014.mbtiles ./jaar-2014.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2015.mbtiles ./jaar-2015.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2016.mbtiles ./jaar-2016.geojson -l roads -f -pf -pk
tippecanoe -o ./flanders-year-2017.mbtiles ./jaar-2017.geojson -l roads -f -pf -pk
