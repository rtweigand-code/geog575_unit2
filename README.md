# Lab 1 Revision Summary

## Representation
The main issue was that the legend circles overlapped and were difficult to read at certain scales.

To fix this:
- I redesigned the proportional symbol legend so circles are dynamically stacked from the very bottom of legend box, while also seperating the symbols
- This prevents overlap regardless of years symbol size
- I also switched to rounded legend values

---

## Interaction
The original map allowed unlimited zoom and pan, which made it easy for users to lose context.

To improve this:
- I added zoom constraints (`minZoom`, `maxZoom`)
- I added geographic bounds to keep the map focused on the Big Ten schools (U.S)

This keeps the interaction more controlled and aligned with the purpose of the map.

---

## Design for Scenario
The feedback noted that the map did not clearly prompt users to think about what might be driving revenue differences.

Just to note when choosing the topic and ultimately working with and visualizing the data I wasn't overly impressed with the results or they at least didn't quite meet my expectations. While spatiotemporal patterns are still present they aren't very distingushed. Which basically has made it somehwat difficult trying to get the most out of the data design. 

To address this:
- I revised the map description to highlight possible drivers such as media rights deals, NIL, COVID Era, etc over specific time periods to help users recognize patterns.
- I added hover tooltips to make it easier to quickly identify schools without clicking each symbol

These changes help guide the user toward interpreting patterns rather than just viewing the data.

---

## Good Coding Practice
The original submission had minimal commenting.

To improve this:
- Added comments to html 
- added comments to style css
- added a couple additional comments to the main js

