cd geojson-transform
npm install
cd ..

# Because variables are life
combined="UrbAdm_COMBINED.geojson"
level_plus1="UrbAdm_STREET_SURFACE_LEVEL_PLUS1.geojson"
level_minus1="UrbAdm_STREET_SURFACE_LEVEL_MINUS1.geojson"
level0="UrbAdm_STREET_AXIS.geojson"
output="UrbAdm_STREET_TAGS.geojson"

level_plus1_output="UrbAdm_STREET_SURFACE_LEVEL_PLUS1_TAGS.geojson"
level_minus1_output="UrbAdm_STREET_SURFACE_LEVEL_MINUS1_TAGS.geojson"
level0_output="UrbAdm_STREET_AXIS_TAGS.geojson"

# First we convert from Urbis tags to OSM tags 
# Usage: node processUrbis.js fileToConvert outputYouWant
node processUrbis.js /sharedfolder/$level_plus1 /sharedfolder/$level_plus1_output
node processUrbis.js /sharedfolder/$level_minus1 /sharedfolder/$level_minus1_output
node processUrbis.js /sharedfolder/$level0 /sharedfolder/$level0_output

# We now merge the three files together
# Usage: geojson-merge file1 file2 file3 > output
geojson-merge /sharedfolder/$level0_output /sharedfolder/$level_minus1_output /sharedfolder/$level_plus1_output > /sharedfolder/$combined

echo "processjs completed"
