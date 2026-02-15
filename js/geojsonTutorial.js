/* Using GeoJSON with Leaflet tutorial */

//create the map and set starting center + zoom
var map = L.map('map').setView([39.74739, -105], 13);

//add OpenStreetMap tile layer as the basemap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//this is a single GeoJSON feature (hard-coded example from tutorial)
var geojsonFeature = {
  "type": "Feature",
  "properties": {
    "name": "Coors Field",
    "amenity": "Baseball Stadium",
    "popupContent": "This is where the Colorado Rockies play!"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.99404, 39.75621]
  }
};

//add the GeoJSON feature to the map
//onEachFeature runs once for every feature in the GeoJSON
L.geoJSON(geojsonFeature, {
  onEachFeature: function (feature, layer) {
    //if popupContent exists in properties, attach it as a popup
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }
}).addTo(map);
