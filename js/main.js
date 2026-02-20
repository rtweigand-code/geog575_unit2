/* Activity 5 - loading my global cities population dataset w leaflet */

var map;

// create the map and add basemap
function createMap() {

  // start centered on the world
  map = L.map("map", {
    center: [20, 0],
    zoom: 2
  });

  // using a lighter basemap so it’s less cluttered
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(map);

  // call function to load my geojson data
  getData();
}

// function to attach popup content to each city
function onEachFeature(feature, layer) {

  var props = feature.properties;

  // start popup with city name + country
  var popupContent = "<strong>" + props.city + "</strong><br>" + props.country;

  // loop through population fields and add them to popup
  for (var property in props) {
    if (property.indexOf("Pop_") === 0) {
      popupContent += "<br>" + property + ": " + props[property];
    }
  }

  // bind popup to the circle marker
  layer.bindPopup(popupContent);

  // show city name on hover so it’s easier to see what’s what
  layer.bindTooltip(props.city);
}

// load the geojson file and add it to the map
function getData() {

  fetch("data/worldCitiesPop.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {

      // circle point styling
      var geojsonMarkerOptions = {
        radius: 10,
        fillOpacity: 0.8,
        weight: 1
      };

      var citiesLayer = L.geoJSON(json, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
      }).addTo(map);

      // zoom map to fit all 15 cities
      map.fitBounds(citiesLayer.getBounds(), { padding: [30, 30] });

    })
    .catch(function (error) {
      console.log("error loading geojson:", error);
    });
}

// run everything once page finishes loading
document.addEventListener("DOMContentLoaded", createMap);