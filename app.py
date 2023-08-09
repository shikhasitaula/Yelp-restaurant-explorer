import sqlalchemy
from sqlalchemy import create_engine, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import numpy as np
import json

from flask import Flask, jsonify
# Database Setup
engine = create_engine(
    "sqlite:///project_3/Resources/restaurants.db", echo=True)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)
#
print(Base.classes.keys())

# Save references to each table
Metadata = Base.classes.restaurant_metadata
Cuisine = Base.classes.restaurant_cuisine
States = Base.classes.states


# Flask Setup
app = Flask(__name__)
# Flask Routes


@app.route('/')
def index():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/cuisines<br/>"
        f"/api/v1.0/restaurant_info<br/>"
        f"/api/v1.0/states"
    )


@app.route("/api/v1.0/states")
def states():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Find the most recent date in the data set.
    unique_states = session.query(States.state, States.alias).all()
    session.close()

    state_list = []
    for state, alias in unique_states:
        state_dict = {}
        state_dict["state"] = state
        state_dict["alias"] = alias

        state_list.append(state_dict)

    return jsonify(state_list)


@app.route("/api/v1.0/cuisines")
def cuisines():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Find the most recent date in the data set.
    unique_cuisines = session.query(Cuisine.cuisines).distinct().all()
    session.close()
    cuisine_list = []
    for cuisine in unique_cuisines:
        cuisine_list.append({"cuisine": cuisine.cuisines})

    return jsonify(cuisine_list)


@app.route("/api/v1.0/restaurant_info")
def location():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Find the most recent date in the data set.
    restaurants = session.query(Metadata).all()
    session.close()
    restaurants_list = []
    for restaurant in restaurants:
        restaurant_dict = {
            "id": restaurant.id,
            "name": restaurant.name,
            "url": restaurant.url,
            "review_count": restaurant.review_count,
            "rating": restaurant.rating,
            "price": restaurant.price,
            "latitude": restaurant.latitude,
            "longitude": restaurant.longitude,
            "city": restaurant.city

        }
        restaurants_list.append(restaurant_dict)

    return jsonify(restaurants_list)


if __name__ == "__main__":
    app.run(debug=True)
