#!/bin/sh
# extracts the diff mbfiles to a folder.
# this uses mb-util: https://github.com/mapbox/mbutil

mb-util --image_format=pbf ./diffs.mbtiles ./diffs-tiles