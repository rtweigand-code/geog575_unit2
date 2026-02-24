/* Activity 6 - proportional symbols + retrieve popups + sequence controls */

var map;
var attributes = [];
var minValue = 0;
var citiesLayer; // store the geojson layer so we can update it

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

  // load my geojson data
  getData();
}

// build an attributes array from the data (Pop_year fields)
function processData(data) {

  var props = data.features[0].properties;

  for (var attribute in props) {
    if (attribute.indexOf("Pop_") === 0) {
      attributes.push(attribute);
    }
  }

  return attributes;
}

// get the minimum value across all Pop_ fields (needed for flannery scaling)
function calcMinValue(data) {

  var allValues = [];

  for (var feature of data.features) {
    for (var attr of attributes) {
      var value = Number(feature.properties[attr]);
      if (!isNaN(value)) {
        allValues.push(value);
      }
    }
  }

  minValue = Math.min(...allValues);
}

// flannery scaling
function calcPropRadius(attValue) {
  var minRadius = 5;
  var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;
  return radius;
}

// build popup html for current attribute
function buildPopupContent(props, attribute) {

  var popupContent = "<p><b>" + props.city + "</b><br>" + props.country + "</p>";

  var year = attribute.split("_")[1];
  popupContent += "<p><b>Population " + year + ":</b> " + props[attribute] + "</p>";

  return popupContent;
}

// convert each point to a circle marker w proportional radius + popup
function pointToLayer(feature, latlng, attributes) {

  // start with the first attribute in the sequence
  var attribute = attributes[0];
  var props = feature.properties;

  var options = {
    fillColor: "#2c7fb8",
    color: "#000",
    weight: 1,
    fillOpacity: 0.8
  };

  var attValue = Number(props[attribute]);
  options.radius = calcPropRadius(attValue);

  var layer = L.circleMarker(latlng, options);

  // retrieve popup
  var popupContent = buildPopupContent(props, attribute);

  layer.bindPopup(popupContent, {
    offset: new L.Point(0, -options.radius)
  });

  return layer;
}

// add the geojson layer to the map
function createPropSymbols(data, attributes) {

  citiesLayer = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(map);

  // zoom map to fit all cities
  map.fitBounds(citiesLayer.getBounds(), { padding: [30, 30] });
}

// update proportional symbols + popup content when sequencing
function updatePropSymbols(attribute) {

  citiesLayer.eachLayer(function (layer) {

    if (layer.feature && layer.feature.properties[attribute]) {

      var props = layer.feature.properties;

      // update radius
      var radius = calcPropRadius(Number(props[attribute]));
      layer.setRadius(radius);

      // update popup content
      var popupContent = buildPopupContent(props, attribute);
      var popup = layer.getPopup();
      popup.setContent(popupContent);

      // keep popup offset matching symbol size
      popup.options.offset = new L.Point(0, -radius);
    }
  });
}

// create slider + arrow buttons (like lab example)
function createSequenceControls(attributes) {

  // slider layout 
  var controlsHTML = `
    <div class="sequence-control">
      <button class="step" id="reverse">&#9664;</button>
      <input class="range-slider" type="range"></input>
      <button class="step" id="forward">&#9654;</button>
    </div>
  `;

  document.querySelector("#panel").insertAdjacentHTML("beforeend", controlsHTML);

  // set slider attributes
  var slider = document.querySelector(".range-slider");
  slider.max = attributes.length - 1;
  slider.min = 0;
  slider.value = 0;
  slider.step = 1;

  // arrow click listeners
  document.querySelectorAll(".step").forEach(function (step) {
    step.addEventListener("click", function () {

      var index = Number(slider.value);

      if (step.id === "forward") {
        index++;
        index = index > attributes.length - 1 ? 0 : index;
      } else if (step.id === "reverse") {
        index--;
        index = index < 0 ? attributes.length - 1 : index;
      }

      slider.value = index;
      updatePropSymbols(attributes[index]);
    });
  });

  // slider input listener
  slider.addEventListener("input", function () {
    updatePropSymbols(attributes[Number(this.value)]);
  });
}

// load the geojson file
function getData() {

  fetch("data/worldCitiesPop.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {

      // build attributes array + min value
      processData(json);
      calcMinValue(json);

      // make proportional symbols + controls
      createPropSymbols(json, attributes);
      createSequenceControls(attributes);

      // quick console check
      console.log("sequence attributes:", attributes);
      console.log("minValue:", minValue);

    })
    .catch(function (error) {
      console.log("error loading geojson:", error);
    });
}

// run everything once page finishes loading
document.addEventListener("DOMContentLoaded", createMap);