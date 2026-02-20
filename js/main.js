/* Activity 5 - main Leaflet map using GeoJSON */

var map;

//make the map
function createMap() {
  map = L.map("map", {
    center: [20, 0],
    zoom: 2
  });

  //basemap tiles
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  //loads my data
  getData();
}

//popup for each feature
function onEachFeature(feature, layer) {
  var props = feature.properties;

  //basic header
  var popupContent = "<strong>" + props.city + "</strong><br>" + props.country;

  //add all population fields
  for (var property in props) {
    if (property.indexOf("Pop_") === 0) {
      popupContent += "<br>" + property + ": " + props[property];
    }
  }

  layer.bindPopup(popupContent);
}

//fetch the geojson and add to map
function getData() {
  fetch("data/worldCitiesPop.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {

      //circle marker points style
      var geojsonMarkerOptions = {
        radius: 7,
        fillOpacity: 0.8,
        weight: 1
      };

      L.geoJSON(json, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
      }).addTo(map);
    })
    .catch(function (error) {
      console.log("error loading geojson:", error);
    });
}

//run once the page loads
document.addEventListener("DOMContentLoaded", createMap);