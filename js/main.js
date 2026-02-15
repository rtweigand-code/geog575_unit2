// main.js
// building my leaflet map for the lab dataset

// create the map
var map = L.map("map").setView([43.0731, -89.4012], 11);

// add basemap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// load my GeoJSON
fetch("data/yourData.geojson")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {

    var geojsonLayer = L.geoJSON(data, {
      onEachFeature: function(feature, layer) {

        var props = feature.properties;

        var popupContent = "<b>Record</b>";

        for (var key in props) {
          popupContent += "<br>" + key + ": " + props[key];
        }

        layer.bindPopup(popupContent);
      }
    }).addTo(map);

    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch(function(error) {
    console.log("error loading geojson:", error);
  });
