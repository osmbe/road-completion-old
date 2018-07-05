Requirements
============

A road completion tool for OSM mappers.

- Visualize the problems that need fixing. This means showing the differences.
- Make it easy for them to fix the problems.
  - This means, showing details about the problem in an easy to understand way.
  - Enable mappers to set the status of a problem.
  - Document how to use this tool.
  - Close integration with editing tools.
  - Find a way too resolve unfixable issues.
- Update problems with current OSM data (or something) and latest open-data version.
  - Handled problems shoudn't show up on the map anymore.
- Publish statistics and quality metrics, to validate the work.
  - Logging who did what work.

# How would this work?

We make a comparison tool (yay, we already have this).
  - Update this to use Urbis.
  - Update this to take into account tags/attributes.
  - Spit out statistics and metrics about quality.
  - We make a way to feedback false positives.

We make a map and display the problems.
  - We make a way for users to login.
  - We make a way to log who did what.
  - We make a way for users to fix the problem in any editor/OSM best practice way.
  - We make a fancy way of displaying the problem.
  - We make a way for users to set status of an issue.
  - We make a way for users to convert an issue to a note.
    - We make a way for an issue to close, after the note is closed.

Document all the things.

# How would we do this ?


## Comparison tool.

###### Update this to Urbis.
  - Extract UrbisAdm map files and compare the Urb_STREET_AXIS to OSM's ways to check if they match or are very close to matching(since it might be impossible to have 100% accuracy).
    This method would/should work for street/way matching.
###### Update this to take into account tags/attributes.
    - Read the documentation on what their tags (i'm gonna use the word tags here) actually mean.
      - You can find those here :
        - [Dutch version](https://s.irisnet.be/v1/AUTH_ce3f7c74-fbd7-4b46-8d85-53d10d86904f/Documentation/UrbIS.zip).
        - [French version](https://s.irisnet.be/v1/AUTH_ce3f7c74-fbd7-4b46-8d85-53d10d86904f/Documentation/UrbIS.zip).
    - For those tags, we make a conversion table that will permit us to identify which UrbIS tags corresponds to our OSM tags (make a translation of UrbIS tags into OSM tags).
    - *Then we could add those tags to the geojson file. Like that we have the conversion of the .shp file from UrbIS into a compatible geojson file with appropriate tags.*
###### Spit out statistics and metrics about quality.
  -
###### We make a way to feedback false positives.
  -
## Making a map & displaying the problems

###### We make a way for users to login.
  - For this, we're gonna use the actual OSM's account authentication tool (this already contains OAuth mechanism).
    - You can find more informations about OAuth [here](https://wiki.openstreetmap.org/wiki/OAuth).
###### We make a ay to log who did what.
  -
###### We make a way for users to fix the problem in any editor/OSM best practice way.
  -
###### We make a fancy way of displaying the problem.
  - In order to make a **user-friendly** tool, we need to have a clear vision of the map (we have to see the difference between the normal map & the issues).
    - The issues will be <span style="background-color: #FFFF00">highlighted</span>.
###### We make a way for users to set status of an issue.
  -
###### We make a way for users to convert an issue to a note.
  - We make a way for an issue to close, after the note is closed.
    -


