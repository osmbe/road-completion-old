
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

#### Update this to Urbis.
  - Extract UrbisAdm map files and compare the Urb_STREET_AXIS to OSM's ways to check if they match or are very close to matching(since it might be impossible to have 100% accuracy).
    This method would/should work for street/way matching.
#### Update this to take into account tags/attributes.
  - Read the documentation on what their tags (i'm gonna use the word tags here) actually mean.
    - You can find those here :
      - [Dutch version](https://s.irisnet.be/v1/AUTH_ce3f7c74-fbd7-4b46-8d85-53d10d86904f/Documentation/UrbIS.zip).
      - [French version](https://s.irisnet.be/v1/AUTH_ce3f7c74-fbd7-4b46-8d85-53d10d86904f/Documentation/UrbIS.zip).
  - For those tags, we make a conversion table that will permit us to identify which UrbIS tags corresponds to our OSM tags (make a translation of UrbIS tags into OSM tags).
  - *Then we could add those tags to the geojson file. Like that we have the conversion of the .shp file from UrbIS into a compatible geojson file with appropriate tags.*
#### Spit out statistics and metrics about quality.
  - Statistics should contain:
	  -	**Main comparison**: street count osm & urbis, % completion
	  -	**Advanced comparison**: detailed statistics for osm & urbis data. 
#### We make a way to feedback false positives.
  - Either by having the user write a note or by giving the user to report a false positive inside the comparison tool, false positives will not be taken into account in further comparisons.
## Making a map & displaying the problems

#### We make a way for users to login.
  - For this, we're gonna use the actual OSM account authentication tool (this already contains OAuth mechanism).
    - You can find more information about OAuth [here](https://wiki.openstreetmap.org/wiki/OAuth).
#### We make a way to log who did what.
  - when changing the status of an issue:
	  - save change to database
	  - link to user using the osm user_id
#### We make a way for users to fix the problem in any editor/OSM best practice way.
  - Online OSM editor: 
	  - open the OSM editor while passing lat & long from the selected issue
	  - www.openstreetmap.org/edit?editor=id#map=zoom/long/lat
	  - example: edit?editor=id#map=14/51.1702/4.2663
  - Offline editors (remote control):
	  - JOSM
	  - Merkaartor
#### We make a fancy way of displaying the issues.
  - In order to make a **user-friendly** tool, we need to have a clear vision of the map (we have to see the difference between the normal map & the issues).
    - Visually, the issues will be highlighted on the map.
    - When we will click on the issue, it will display a clear summary which contains the tags that are different (the summary is actually a sidebar that is displayed at the map's right side).
      - There will be an edit button that will redirect mappers to the edit tool.
#### We make a way for users to set status of an issue.
  - Fixed: 
	  - Log to system
	  - No need to save the fixed status to the system. When rerunning the comparison tool it will not show up when the problem is fixed. 
- False possitive
	- feed the false possitive into the comparison tool
- Other (for example when an issue needs a fysical check)
	- convert issue to a note
#### We make a way for users to convert an issue to a note.
  - We make a way for an issue to close, after the note is closed.
    
