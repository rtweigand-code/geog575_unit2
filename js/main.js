/* Lab 1 - Big Ten athletic revenue map
   proportional symbols + retrieve + sequence + legends */

var map;
var attributes = [];
var minValue;
var schoolsLayer;
var currentAttribute;


// set up the map
function createMap() {

  map = L.map("map", {
    center: [40, -96],
    zoom: 4
  });

  // light basemap so the circles stand out better
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(map);

  getData();
}


// grab the revenue fields from the data
function processData(data) {
  var properties = data.features[0].properties;

  for (var attribute in properties) {
    if (attribute.indexOf("Rev_") === 0) {
      attributes.push(attribute);
    }
  }

  return attributes;
}


// find smallest value for proportional symbol scaling
function calcMinValue(data) {
  var allValues = [];

  for (var feature of data.features) {
    for (var attribute of attributes) {
      var value = Number(feature.properties[attribute]);
      if (!isNaN(value)) {
        allValues.push(value);
      }
    }
  }

  minValue = Math.min(...allValues);
}


// flannery scaling for circle sizes
function calcPropRadius(attValue) {
  var minRadius = 12;
  var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;
  return radius;
}


// popup text for each school
function buildPopupContent(props, attribute) {
  var year = attribute.split("_")[1];

  var popupContent = "<p><b>" + props.Name + "</b></p>";
  popupContent += "<p><b>Revenue " + year + ":</b> $" + Number(props[attribute]).toLocaleString() + "</p>";

  return popupContent;
}


// make the point features into circle markers
function pointToLayer(feature, latlng, attributes) {
  var attribute = attributes[0];
  var props = feature.properties;

  var options = {
    fillColor: "#c8102e",
    color: "#111",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  var attValue = Number(props[attribute]);
  options.radius = calcPropRadius(attValue);

  var layer = L.circleMarker(latlng, options);

  var popupContent = buildPopupContent(props, attribute);

  layer.bindPopup(popupContent, {
    offset: new L.Point(0, -options.radius)
  });

  return layer;
}


// add the proportional symbols to the map
function createPropSymbols(data, attributes) {
  schoolsLayer = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(map);
}


// update the circles + popups when year changes
function updatePropSymbols(attribute) {
  currentAttribute = attribute;

  schoolsLayer.eachLayer(function (layer) {
    if (layer.feature && layer.feature.properties[attribute]) {
      var props = layer.feature.properties;

      var radius = calcPropRadius(Number(props[attribute]));
      layer.setRadius(radius);

      var popupContent = buildPopupContent(props, attribute);
      var popup = layer.getPopup();
      popup.setContent(popupContent);

      popup.options.offset = new L.Point(0, -radius);
    }
  });

  updateLegend(attribute);
}


// sequence slider control inside Leaflet
function createSequenceControls(attributes) {

  var SequenceControl = L.Control.extend({
    options: {
      position: "bottomleft"
    },

    onAdd: function () {
      var container = L.DomUtil.create("div", "sequence-control-container");

      container.innerHTML =
        '<button class="step" id="reverse" title="Previous year">&#9664;</button>' +
        '<input class="range-slider" type="range">' +
        '<button class="step" id="forward" title="Next year">&#9654;</button>';

      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);

      return container;
    }
  });

  map.addControl(new SequenceControl());

  var slider = document.querySelector(".range-slider");
  slider.max = attributes.length - 1;
  slider.min = 0;
  slider.value = 0;
  slider.step = 1;

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

  slider.addEventListener("input", function () {
    var index = Number(this.value);
    updatePropSymbols(attributes[index]);
  });
}


// legend control
function createLegend(initialAttribute) {

  var LegendControl = L.Control.extend({
    options: {
      position: "bottomright"
    },

    onAdd: function () {
      var container = L.DomUtil.create("div", "legend-control-container");

      container.innerHTML =
        '<div class="temporal-legend">' +
          '<div id="legend-year">Year: ' + initialAttribute.split("_")[1] + '</div>' +
        '</div>' +
        '<div class="symbol-legend">' +
          '<div class="legend-title">Athletic Revenue</div>' +
          '<svg id="attribute-legend" width="250" height="170">' +
            '<circle class="legend-circle" id="circle-top" cx="70"></circle>' +
            '<circle class="legend-circle" id="circle-mid" cx="70"></circle>' +
            '<circle class="legend-circle" id="circle-low" cx="70"></circle>' +
            '<text id="text-top" x="140" y="40"></text>' +
            '<text id="text-mid" x="140" y="85"></text>' +
            '<text id="text-low" x="140" y="130"></text>' +
          '</svg>' +
        '</div>';

      L.DomEvent.disableClickPropagation(container);
      return container;
    }
  });

  map.addControl(new LegendControl());
  updateLegend(initialAttribute);
}


// update year + rounded legend circles
function updateLegend(attribute) {
  var year = attribute.split("_")[1];

  var yearLabel = document.getElementById("legend-year");
  if (yearLabel) {
    yearLabel.innerHTML = "Year: " + year;
  }

  var legendValues = getRoundedLegendValues(attribute);

  var circleIDs = {
    top: "circle-top",
    mid: "circle-mid",
    low: "circle-low"
  };

  var textIDs = {
    top: "text-top",
    mid: "text-mid",
    low: "text-low"
  };

  var positions = {
    top: 40,
    mid: 85,
    low: 130
  };

  for (var key in legendValues) {
    var radius = calcPropRadius(legendValues[key]);
    var cy = positions[key];

    var circle = document.getElementById(circleIDs[key]);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);

    var text = document.getElementById(textIDs[key]);
    text.setAttribute("y", cy + 5);
    text.textContent = "$" + (legendValues[key] / 1000000) + "M";
  }
}


// get rounded legend values that still update with the sequence
function getRoundedLegendValues(attribute) {
  var max = -Infinity;

  schoolsLayer.eachLayer(function (layer) {
    var value = Number(layer.feature.properties[attribute]);
    if (!isNaN(value)) {
      max = Math.max(max, value);
    }
  });

  // round top value up to nearest 25 million
  var roundedMax = Math.ceil(max / 25000000) * 25000000;

  return {
    top: roundedMax,
    mid: Math.round((roundedMax * 0.67) / 25000000) * 25000000,
    low: Math.round((roundedMax * 0.33) / 25000000) * 25000000
  };
}


// load the GeoJSON
function getData() {
  fetch("data/BigTen_Revenue_wide.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      attributes = processData(json);
      calcMinValue(json);

      createPropSymbols(json, attributes);
      createSequenceControls(attributes);
      createLegend(attributes[0]);

      currentAttribute = attributes[0];
    })
    .catch(function (error) {
      console.log("error loading geojson:", error);
    });
}


// run map when page loads
document.addEventListener("DOMContentLoaded", createMap);