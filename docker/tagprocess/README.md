# Tag process

- These scripts convert Urbis, Wegenregister and some Mobigis tags to OSM tag equivalents.

## Scripts

- process.js converts Wegenregister tags to OSM tags.
- processUrbis.js converts Urbis tags to OSM tags.
- (WIP) processCobblestone.js converts Mobigis cobblestone data to OSM tag.
- process.sh is used by the docker image to automate the urbis tag conversion in multiple files, it also merges all those files together.