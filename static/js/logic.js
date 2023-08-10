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
    document.getElementById('map').style.height = '450px';

    // Copied from https://stackoverflow.com/questions/15089541/leaflet-map-loading-half-greyed-tiles
     map.invalidateSize();
}

initializeMap();

function populateStates() {
    // Make an API call to get the list of states and populate them into state dropdown
    stateUrl = "http://127.0.0.1:5000/api/v1/states";

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
            .text(state => state.name)
            .on("click", function(d, state) {
                // Change the dropdown name to state name
                d3.select("#stateButton").text(state.name);

                // update the map to focus on this state
                var coordinates = stateCoordinates[state.name];
                map.setView(coordinates, 6);
                // Populate all the cuisines from this state to cuisine dropdown
                populateCuisine(state.alias);
                
                // Add restaurant markers to leaflet tiles 
                populateRestaurants(state.alias)
                // Create a stackbar
                stackedBarChart(state.alias);
            })
    });
}

populateStates();

function populateCuisine(state) {
    // Make another APi call to get the list of cuisines in selected state
    let cuisineUrl = 'http://127.0.0.1:5000/api/v1/cuisines/' + state;

    // First clear the existing items from the dropdown
    d3.select("#cuisineSelect").selectAll('li').remove();

    // Reset the button name
    d3.select("#cuisineButton").text('Cuisine')

    // Reset the bar graph
    d3.select("#bar").html("");

    d3.json(cuisineUrl).then(function(result) {    
        // Populate bar chart showing restaurant and count
        let xValues = result.map(function(data) { return data.name; });
        let yValues = result.map(function(data) { return data.count; });
        pieChart(xValues, yValues);

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

                // Create a stackbar
                stackedBarChart(state , i.name);

            });
    });
}

function populateRestaurants(state, cuisine) {
    // If there are markers already, remove those
    if (restaurantLayer) {
        map.removeLayer(restaurantLayer);
    }
    let restaurantUrl
    if(typeof cuisine == 'undefined') {
        restaurantUrl =  `http://127.0.0.1:5000/api/v1/restaurants/${state}`
    } else {
        restaurantUrl =  `http://127.0.0.1:5000/api/v1/restaurants/${state}/${cuisine}`
    }
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

// function to plot the pieChart.
function pieChart(xValues, yValues){
    let data = [{
        values: yValues,
        labels: xValues,
        type: "pie",
        hole: 0.4,
        textinfo: "label+percent", // Display both label and percentage inside slices
        insidetextorientation: "radial" // Place the text radially inside the slices
    }];
    let layout = {
        title: "Cusine distribution",
        showlegend: false,
        legend: {
            x: 1,
            y: 0.5
        },
        
        // Add more layout customizations here as needed
    };

    Plotly.newPlot("pie", data, layout);
 }
 

 function createPopupContent(data) {
    let address = "N/A";
    try {
       parsedAddress =  JSON.parse(data.address.replace(/'/g, '"'));
       address = parsedAddress.display_address[0] + "<br\>" + parsedAddress.display_address[1]
    } catch(error) {
        // DO nothing
    }

    return `
        <div class="popup-container">
            <div class="row gx-3">
                <div class="col-md-6">
                    <img src=${data.image} alt="${data.name}" class="img-fluid rounded-start" id="popup-image" />
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}</h5>
                        <p class="card-text">${address}</p>
                        <p class="card-text">Rating: ${data.rating}</p>
                        <p class="card-text"><a href="${data.url}" target="_blank">More details</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function stackedBarChart(state , cuisine) {
    let priceAndRatingUrl
    if(typeof cuisine == 'undefined') {
        priceAndRatingUrl =  `http://127.0.0.1:5000/api/v1/price-rating/${state}`
    } else {
        priceAndRatingUrl =  `http://127.0.0.1:5000/api/v1/price-rating/${state}/${cuisine}`
    }
    d3.json(priceAndRatingUrl).then(function(result) {
        
        // Dividing ratings into buckets
        var ratingBuckets = ['1-2', '2-3', '3-4', '4-5'];
        var priceRange = ['$', '$$', '$$$', '$$$$'];

        var traces = [];

        for (let i = 0; i < ratingBuckets.length; i++) {
            let priceCount = [0, 0, 0, 0];
            for (let j = 0; j < result.length; j++) {
                if (Math.floor(result[j].rating) !== i + 1) {
                    continue;
                } 

                if (result[j].price === '$') {
                    priceCount[0] += result[j].count;
                } else if (result[j].price === '$$') {
                    priceCount[1] += result[j].count;
                } else if (result[j].price === '$$$') {
                    priceCount[2] += result[j].count;
                } else if (result[j].price === '$$$$') {
                    priceCount[3] += result[j].count;
                }
            }

            let trace =  {
                x: priceRange,
                y: priceCount,
                name: `Rating [${i + 1}-${i + 2}]`,
                type: 'bar'
              };

              traces.push(trace);
        }
        
        var layout = {
            barmode: 'stack',
            title: 'Rating Distribution by Price Range',
            xaxis: { title: 'Price Range' },
            yaxis: { title: 'Count' },
            showlegend: true
          };

          Plotly.newPlot('stacked-bar', traces, layout);
    });
 }