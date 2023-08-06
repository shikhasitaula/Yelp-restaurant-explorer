// #Business Search      URL -- 'https://api.yelp.com/v3/businesses/search'
// #Business Match       URL -- 'https://api.yelp.com/v3/businesses/matches'
// #Phone Search         URL -- 'https://api.yelp.com/v3/businesses/search/phone'

// #Business Details     URL -- 'https://api.yelp.com/v3/businesses/{id}'
// #Business Reviews     URL -- 'https://api.yelp.com/v3/businesses/{id}/reviews'

// get the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

import request
from YelpAPI import get_my_key




//  build a meta data Demographic

function showMetaData(selectedSample) {
  d3.json(url).then((data)=>{
  let metaData1 = data.metadata;
  let newarray = metaData1.filter( sampleobject => sampleobject.id == selectedSample)
  let result = newarray [0];

console.log("result2", result);

let metadataDisplay = d3.select("#sample-metadata");
metadataDisplay.html("");
Object.entries(result).forEach(([key, value]) => {
  // metadataDisplay.append("h3").text(`${key}: ${value}`);
  metadataDisplay.append("h3").text(`${key}: ${value}`);
});
});
}

function buildCharts(selectedSample) {
d3.json(url).then(function(data) {
//   console.log(data);

























// // Filter the data to get the information for the selected sample
// let selectedData = data.samples.filter(sample => sample.id === selectedSample);
// let newData = selectedData[0]

// // Get the top 10 OTUs for the selected sample
// let sampleValues = newData.sample_values.slice(0, 10).reverse();
// let otuIDs = newData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
// let otuLabels = newData.otu_labels.slice(0, 10).reverse();

// // Create the trace for the horizontal bar chart
// let trace1 = {
//   x: sampleValues,
//   y: otuIDs,
//   text: otuLabels,
//   name: "OTUs",
//   type: "bar",
//   orientation: "h"
// };

// // Define the layout for the chart
// let layout = {
//   title: "Top 10 OTUs Found",
//   xaxis: { title: "Sample Values" },
//   yaxis: { title: "OTU IDs" },
// };

// // Plot the chart using Plotly
// Plotly.newPlot("bar", [trace1], layout);

//   // Create the trace for the bubble chart
//   let trace2 = {
//     x: newData.otu_ids,
//     y: newData.sample_values,
//     text: newData.otu_labels,
//     mode: "markers",
//     marker: {
//       size: newData.sample_values,
//       color: newData.otu_ids,
//       colorscale: "Earth",
//     },
//   };

//   // Define the layout for the bubble chart
//   let layout2 = {
//     title: "Samples",
//     xaxis: { title: "OTU IDs" },
//     yaxis: { title: "Sample Values" },
//   };

//   // Plot the bubble chart using Plotly
//   Plotly.newPlot("bubble", [trace2], layout2);

// });

// };

// function init() {
//   // grab the item to the dropdown section
//     let selector = d3.select("#selDataset");

//     //use sample name as a select option
//     d3.json(url).then((data) => {

//     let dataNames = data.names;
      
//     for ( let i = 0; i< dataNames.length; i ++) {
//       selector
//         .append("option")
//         .text(dataNames[i])
//         .property("value", dataNames[i]);
//     };
// let firstSample = dataNames[0];


// // Call the buildCharts 
// buildCharts(firstSample, data);

// showMetaData(firstSample)

//   });
// }
// function optionChanged(sampleData2){
//   buildCharts(sampleData2) 
//   showMetaData(sampleData2)
// } 
 
// init();

