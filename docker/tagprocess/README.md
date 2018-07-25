# Tag process

- These scripts convert Urbis, Wegenregister and some Mobigis tags to OSM tag equivalents.

## Scripts

- **process.js**
    - Converts Wegenregister tags to OSM tags.
- **processUrbis.js**
    - Converts Urbis tags to OSM tags.
- **(WIP) processCobblestone.js**
    - Converts Mobigis cobblestone data to OSM tag.
- **process.sh**
    - This script is used by the docker image to automate the urbis tag conversion in multiple files, it also merges all those files together.