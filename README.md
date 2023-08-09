# project_3

Yelp API was used to gather data on 500 restaurants per state, sorted by review count, and extracted it using offsets. After converting the data into a pandas DataFrame, it was cleaned and uploaded to a SQLite database.  We then created tables and added primary keys. Using SQLAlchemy and Flask,  app routes were devoloped for creating visualizations with D3.js.


# Data Extraction:
Used Yelp API to gather restaurant data.



Retrieved 500 restaurants for each state.



Applied offset to navigate through results.



Sorted data by review count

# Data Cleaning:

Converted API data to a pandas DataFrame.


New columns were generated based on existing data to facilitate easier analysis and visualization.


The data was refined by selecting only the relevant columns that focus on key attributes of the restaurants.


To enhance data structuring and analysis, the cuisine information was transformed from an array into individual columns.



# Database Management:
Created an SQLite database named 'restaurants.db'and established a connection to the database.


Two tables were designed to organize restaurant metadata and cuisine information.


A CSV file was used to source state data, which was then converted to a DataFrame and subsequently stored in the 'states' table.

# Database Schema
The tables "restaurant_metadata," "restaurant_cuisine," and "states" were created to store restaurant information, cuisine data, and state information, with primary keys respectively . 


# Web Development:
Utilized SQLAlchemy to interact with the SQLite database.


Developed Flask app routes for different visualization needs.


Flask API route /api/v1.0/states is used to retrieve state information from the database and present it in a structured JSON format.


API route /api/v1.0/cuisines is used to retrieve distinct cuisine information from the database. 


API route /api/v1.0/restaurant_info is used to retrieve restaurant information based on the filters state, cuisine, ratings and price from the database. The route utilizes query parameters to customize the search criteria based on dropdown menu.


API route /api/v1.0/cuisine_distribution serves as a method to calculate and retrieve the distribution of cuisines based on specified filters from the database.


