/* Map of GeoJSON data from MegaCities.geojson (adapted tutorial) */

//declare map var in global scope
var map;

//function to instantiate the Leaflet map
function createMap() {

  //create the map
  map = L.map('map', {
    center: [20, 0],
    zoom: 2
  });

  //add OSM base tilelayer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  //call getData function
  getData();
}

//added…function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
  //no popupContent field in MegaCities, so build it from all properties
  var popupContent = "";

  if (feature.properties) {
    //loop through each property and add it to the popup html
    for (var property in feature.properties) {
      popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
    }
    layer.bindPopup(popupContent);
  }
}

//function to retrieve the data and place it on the map
function getData() {

  //load the data
  fetch("data/MegaCities.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {

      //create marker options (circle markers)
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      //create a Leaflet GeoJSON layer and add it to the map
      L.geoJson(json, {
        //turn each point into a circle marker
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        //attach popups
        onEachFeature: onEachFeature
      }).addTo(map);
    });
}

//run after the page loads
document.addEventListener('DOMContentLoaded', createMap);
