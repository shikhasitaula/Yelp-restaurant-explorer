// #Business Search      URL -- 'https://api.yelp.com/v3/businesses/search'
// #Business Match       URL -- 'https://api.yelp.com/v3/businesses/matches'
// #Phone Search         URL -- 'https://api.yelp.com/v3/businesses/search/phone'

// #Business Details     URL -- 'https://api.yelp.com/v3/businesses/{id}'
// #Business Reviews     URL -- 'https://api.yelp.com/v3/businesses/{id}/reviews'

// coordinates of US staets
var stateCoordinates = {
  "Alabama": [32.806671, -86.791130],
  "Alaska": [61.370716, -152.404419],
  "Arizona": [33.729759, -111.431221],
  "Arkansas": [34.969704, -92.373123],
  "California": [36.116203, -119.681564],
  "Colorado": [39.059811, -105.311104],
  "Connecticut": [41.597782, -72.755371],
  "Delaware": [39.318523, -75.507141],
  "Florida": [27.766279, -81.686783],
  "Georgia": [33.040619, -83.643074],
  "Hawaii": [21.094318, -157.498337],
  "Idaho": [44.240459, -114.478828],
  "Illinois": [40.349457, -88.986137],
  "Indiana": [39.849426, -86.258278],
  "Iowa": [42.011539, -93.210526],
  "Kansas": [38.526600, -96.726486],
  "Kentucky": [37.668140, -84.670067],
  "Louisiana": [31.169546, -91.867805],
  "Maine": [44.693947, -69.381927],
  "Maryland": [39.063946, -76.802101],
  "Massachusetts": [42.230171, -71.530106],
  "Michigan": [43.326618, -84.536095],
  "Minnesota": [45.694454, -93.900192],
  "Mississippi": [32.741646, -89.678696],
  "Missouri": [38.456085, -92.288368],
  "Montana": [46.921925, -110.454353],
  "Nebraska": [41.125370, -98.268082],
  "Nevada": [38.313515, -117.055374],
  "New Hampshire": [43.452492, -71.563896],
  "New Jersey": [40.298904, -74.521011],
  "New Mexico": [34.840515, -106.248482],
  "New York": [42.165726, -74.948051],
  "North Carolina": [35.630066, -79.806419],
  "North Dakota": [47.528912, -99.784012],
  "Ohio": [40.388783, -82.764915],
  "Oklahoma": [35.565342, -96.928917],
  "Oregon": [44.572021, -122.070938],
  "Pennsylvania": [40.590752, -77.209755],
  "Rhode Island": [41.680893, -71.511780],
  "South Carolina": [33.856892, -80.945007],
  "South Dakota": [44.299782, -99.438828],
  "Tennessee": [35.747845, -86.692345],
  "Texas": [31.054487, -97.563461],
  "Utah": [40.150032, -111.862434],
  "Vermont": [44.045876, -72.710686],
  "Virginia": [37.769337, -78.169968],
  "Washington": [47.400902, -121.490494],
  "West Virginia": [38.491226, -80.954218],
  "Wisconsin": [44.268543, -89.616508],
  "Wyoming": [42.755966, -107.302490]
};

// Create a map object that will be used to store the leaflet map object.
let map;

// Keep track of restaurant layer.
let restaurantLayer;

// Creates a map centured on the United States
function initializeMap() {
  map = L.map('map');

  // create a map centered on the United States
  map.setView([37.0902, -95.7129], 4);

  // add a base layer to the map
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
  }).addTo(map);

  // Set the height of the map div (had to ask chatGPT for this)
  document.getElementById('map').style.height = '400px';

  // Copied from https://stackoverflow.com/questions/15089541/leaflet-map-loading-half-greyed-tiles
   map.invalidateSize();
}

initializeMap();

function populateStates() {
  // Make an API call to get the list of states and populate them into state dropdown
  stateUrl = "http://127.0.0.1:5000/states";

  d3.json(stateUrl).then(function(states){
      // load the data into state dropdown
      d3.select("#stateDropdown")
          .selectAll('li')
          .data(states)
          .enter()
          .append('li')
          .append('a')
          .attr('class', 'dropdown-item')
          .attr('href', '#')
          .text(state => state)
          .on("click", function(d, state) {
              // Change the dropdown name to state name
              d3.select("#stateButton").text(state);

              // update the map to focus on this state
              var coordinates = stateCoordinates[state];
              map.setView(coordinates, 6);
          
              // Populate all the cuisines from this state to cuisine dropdown
              populateCuisine(state);
          })
  });
}

populateStates();



function populateCuisine(state) {
  // Make another APi call to get the list of cuisines in selected state
  let cuisineUrl = 'http://localhost:8000/cuisines/' + state;

  // First clear the existing items from the dropdown
  d3.select("#cuisineSelect").selectAll('li').remove();

  // Reset the button name
  d3.select("#cuisineButton").text('Cuisine')

  // Reset the bar graph and pie chart
  d3.select("#bar").html("");
  d3.select("#pie").html("");
 
  d3.json(cuisineUrl).then(function(result) {    
      // Populate bar chart showing restaurant and count
      let xValues = result.map(function(data) { return data.name; });
      let yValues = result.map(function(data) { return data.count; });
      barChart(xValues, yValues);

       // add the cuisines to the dropdown
        d3.select("#cuisineSelect")
          .selectAll('li')
          .data(result)
          .enter()
          .append('li')
          .append('a')
          .attr('class', 'dropdown-item')
          .attr('href', '#')
          .text(cuisine => `${cuisine.name} (${cuisine.count})`)
          .on("click", function(d, i) {
              d3.select("#cuisineButton").text(i.name);

              // Add restaurant markers to leaflet tiles 
              populateRestaurants(state, i.name);

            // Plot pie chart showing cuisine distribution
        plotPieChart(result);  

          // Plot stacked bar chart showing distribution of ratings within price ranges
          plotStackedBarChart(state, i.name);

          });
  });
}


// Function to plot the pie chart.
function plotPieChart(data) {
  let labels = data.map(cuisine => cuisine.name);
  let values = data.map(cuisine => cuisine.count);

  let trace = {
    labels: labels,
    values: values,
    type: "pie"
  };

  let layout = {
    title: "Cuisine Distribution"
  };

  Plotly.newPlot("pie", [trace], layout);
}

function populateRestaurants(state, cuisine) {
  // If there are markers already, remove those
  if (restaurantLayer) {
      map.removeLayer(restaurantLayer);
  }

  let restaurantUrl =  `http://localhost:9000/restaurants/${state}/${cuisine}`
  d3.json(restaurantUrl).then(function(restaurants) {

      // Initialze an array to hold the restaurant markers.
      let restaurantMarkers = [];

      // create marker for each restaurant
      for (let index = 0; index < restaurants.length; index++) {
          let restaurant = restaurants[index];
          let restaurantMarker = L.marker(restaurant.coords)
              .bindPopup(createPopupContent(restaurant));

          // Add the marker to the restaurantMarkers array
          restaurantMarkers.push(restaurantMarker);
      }

      // create another layer to show the restaurant marker
      restaurantLayer = L.layerGroup(restaurantMarkers);
      restaurantLayer.addTo(map);
  });
}


function createPopupContent(data) {
  return `
      <div class="popup-container">
          <div class="row gx-3">
              <div class="col-md-4">
                  <img src="static/images/cuisine1.jpg" alt="${data.name}" class="img-fluid rounded-start">
                  <button type="button" class="btn btn-link mt-2">Website</button>
              </div>
              <div class="col-md-8">
                  <div class="card-body">
                      <h5 class="card-title">${data.name}</h5>
                      <p class="card-text">${data.address}</p>
                      <p class="card-text">Rating: ${data.rating}</p>
                  </div>
              </div>
          </div>
      </div>
  `;
}








// // Polulate the scatter chart showing price range and Ratings
// d3.select("scatterPlot").html("");
// d3.json(cuisineUrl).then(function(result) {    
//     // Populate bar chart showing restaurant and count
          
//     let xValues1 = result.map(function(data) { return data.price; });
//     let yValues1 = result.map(function(data) { return data.ratings; });
//     scatterChart(xValues1, yValues1);
// // function to plot the barchart.

// function ScatterPlot(xValues1, yValues1){
// let data = [{
//   x: xValues1,
//   y: yValues1,
//   mode : "circle",
//   type: "scatter"
// }];
// let layout = {
// title: "scatter Plot Prices vs Ratings",
// xaxis: Price ,
// yaxis: ratings
   
// }}
// };
// Plotly.newPlot("scatter", data, layout)






// function StackedBarChart(data) {
//   let priceRanges = ['$', '$$', '$$$', '$$$$'];
//   let traces = [];

//   data.forEach(cuisine => {
//     let xValues = priceRanges;
//     let yValues = priceRanges.map(price => cuisine.ratings[price] || 0);

//     traces.push({
//       x: xValues,
//       y: yValues,
//       name: cuisine.name,
//       type: 'bar'
//     });
//   });

//   let layout = {
//     barmode: 'stack',
//     title: 'Ratings Distribution by Price Range'
//   };

//   Plotly.newPlot('StackedBarChart', traces, layout);
// }





// function PieChart(data) {
//   let labels = data.map(cuisine => cuisine.name);
//   let values = data.map(cuisine => cuisine.count);

//   let trace = {
//     labels: labels,
//     values: values,
//     type: 'pie'
//   };

//   let layout = {
//     title: 'Cuisine Distribution'
//   };

//   Plotly.newPlot('cuisinePieChart', [trace], layout);
// }













