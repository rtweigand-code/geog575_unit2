/* Adapted tutorial: load MegaCities.geojson with fetch and map it */

//declare map in global scope so other functions can use it
var map;

//create the leaflet map
function createMap() {
  //set starting view (world view like the example)
  map = L.map("map", {
    center: [20, 0],
    zoom: 2
  });

  //add OSM basemap tiles
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  //load the geojson after the map is ready
  getData();
}

//run once for each feature to attach popup
function onEachFeature(feature, layer) {
  var popupContent = "";

  //loop through all properties and build a popup string
  if (feature.properties) {
    for (var property in feature.properties) {
      popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
    }
    layer.bindPopup(popupContent);
  }
}

//fetch the data and add it to the map
function getData() {
  fetch("data/MegaCities.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {

      //circle marker styling (from the tutorial)
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      //add geojson to map
      L.geoJSON(json, {
        //turn points into circleMarkers
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        //attach popups
        onEachFeature: onEachFeature
      }).addTo(map);
    })
    .catch(function (error) {
      console.log("error loading MegaCities.geojson:", error);
    });
}

//wait until the page loads, then build the map
document.addEventListener("DOMContentLoaded", createMap);
