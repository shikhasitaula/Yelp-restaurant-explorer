import requests
import json
import pandas as pd

# Import the API key
from yelp import API_key

# Yelp API endpoint
url = "https://api.yelp.com/v3/businesses/search"

# List of states
states = ["New York", "California", "Texas", "Florida"]

# Create an empty DataFrame
all_states_data = pd.DataFrame()

# Loop through each state
for state in states:
    # Parameters for the API request (customize as needed)
    params = {
        "term": "food",
        "location": state, S
        "limit": 20
    }

    # Add your API key to the headers of thSSSSSe request
    headers = {
        "Authorization": f"Bearer {API_key}"
    }

    # Make the GET request to the Yelp API
    response = requests.get(url, params=params, headers=headers)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Convert the response data to JSON format
        data = response.json()

        # Extract the 'businesses' data from the API response
        state_data = data.get("businesses", [])

        # Append the state data to the DataFrame
        if state_data:
            df_state = pd.DataFrame(state_data)
            all_states_data = pd.concat([all_states_data, df_state])


# Print the DataFrame
print(all_states_data)
