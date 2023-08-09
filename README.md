# Restaurant Explorer Dashboard
The Restaurant Explorer Dashboard is a web application that allows users to explore restaurant data across different US states and cuisines. It provides an interactive interface with a Leaflet map, bar charts, and dropdown menus for selecting states and cuisines. We have gone through different steps like ETL, backend(building flask api), frontend( html, css, and javascript) for the completion of this project:

#### Features:
* Dynamic Leaflet map with restaurant markers based on selected state and cuisine.
* Bar charts that display the distribution of cuisines.
* Dropdown menus for selecting US states and cuisines.
* Restaurant popups with detailed information when markers are clicked. 
* Stacked chart that show the relation between price and rating.

## Data collection

Yelp API was used to gather data on 500 restaurants per state, sorted by review count, and extracted it using offsets. After converting the data into a pandas DataFrame, it was cleaned and uploaded to a SQLite database. We then created tables and added primary keys. Using SQLAlchemy and Flask, app routes were devoloped for creating visualizations with D3.js.

1. #### Data Extraction:
- Used Yelp API to gather restaurant data.
- Retrieved 500 restaurants for each state.
- Applied offset to navigate through results.
- Sorted data by review count

2. #### Data Cleaning:
- Converted API data to a pandas DataFrame.
- New columns were generated based on existing data to facilitate easier analysis and visualization.
- The data was refined by selecting only the relevant columns that focus on key attributes of the restaurants.
- To enhance data structuring and analysis, the cuisine information was transformed from an array into individual columns.

3. ### Data Cleaning:
- Converted API data to a pandas DataFrame.
- New columns were generated based on existing data to facilitate easier analysis and visualization.
- The data was refined by selecting only the relevant columns that focus on key attributes of the restaurants.
- To enhance data structuring and analysis, the cuisine information was transformed from an array into individual columns.

4. #### Database Schema
The tables "restaurant_metadata," "restaurant_cuisine," and "states" were created to store restaurant information, cuisine data, and state information, with primary keys respectively .
  
## Flask API
The Restaurant Explorer API is a Flask-based application that provides endpoints to explore restaurant data based on states, cuisines, and more. This API connects to a SQLite database containing restaurant metadata and state information. These are some prerequisites to create flask api:
- Python 3.x
- SQLite database with the necessary tables (restaurant_metadata and states)
- Required Python packages listed in requirements.txt-

We have created 5 routes altogether to for our project:
1. List available API routes:
Open your web browser and navigate to "http://127.0.0.1:5000/"
2. Get unique states:
Retrieve a list of unique states with their aliases.
Endpoint: "http://127.0.0.1:5000/api/v1/states"
3. Get top cuisines:
Retrieve the top 10 cuisines for a specific state.
Endpoint: 'http://127.0.0.1:5000/api/v1/cuisines/<state>'
4. Get restaurants by state and cuisine:
Retrieve restaurants in a specific state that serve a particular cuisine.
Endpoint: "http://127.0.0.1:5000/api/v1/restaurants/<state>/<cuisine>"
5. API route:
serves as a method to calculate and retrieve the distribution of cuisines based on specified filters from the database.
Endpoint: /api/v1.0/cuisine_distribution


## JavaScript

*Dependencies*
The following libraries and frameworks are used in this project:
* Leaflet: A JavaScript library for interactive maps.
* D3.js: A data visualization library for creating dynamic charts and graphs.
* Plotly: An open-source JavaScript graphing library for interactive, publication-quality graphs.

The logic here helps us to initialize a Leaflet map with a base layer from OpenStreetMap and centers it on the United States. It also ensures that the map adjusts its size correctly and is displayed with a height of 400 pixels. We have uses D3.js to make an API call to retrieve a list of states and populates a Bootstrap dropdown menu (#stateDropdown) with the retrieved state data. It also handles the click event on each state item in the dropdown to update the selected state and perform additional actions, such as updating the map focus and populating cuisine data. The function named populateCuisine() that populates a Bootstrap dropdown menu with cuisine options based on the selected state. It also handles the click event on each cuisine item to update the selected cuisine and perform additional actions, such as populating a bar chart and adding restaurant markers to the Leaflet map. We have created 3 functions for 3 different data visualization. 