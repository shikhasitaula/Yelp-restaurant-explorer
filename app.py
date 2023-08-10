import sqlalchemy
from sqlalchemy import create_engine, func, desc
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import numpy as np
import json

from flask import Flask, jsonify, request
# Database Setup
engine = create_engine("sqlite:///project_3/Resources/restaurants.db")

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
        f"/api/v1.0/cuisine_distribution<br/>"
        f"/api/v1.0/price_rating<br/>"
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
    # Find the unique cuisines in the data set.
    unique_cuisines = session.query(Cuisine.cuisines).distinct().all()
    session.close()
    cuisine_list = []
    for cuisine in unique_cuisines:
        cuisine_list.append({"cuisine": cuisine.cuisines})
    
    return jsonify(cuisine_list)

@app.route("/api/v1.0/restaurant_info")
def location():
    state = request.args.get('state', type=str)
    cuisine = request.args.get('cuisine', type=str)
    price = request.args.get('price',type=str)
    rating = request.args.get('rating',type=float)
    
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Joining cuisine with restaurant table and filtering data.
    query = session.query(Metadata)
    if cuisine:
        query=query.join(Cuisine, Metadata.id==Cuisine.id).filter(
            Cuisine.cuisines==cuisine
            )
    if state:
        query=query.filter(Metadata.state==state)
    if price:
        query=query.filter(Metadata.price==price)
    if rating:
        query=query.filter(Metadata.rating>=rating)
    
    restaurants = query.all()
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
            "city": restaurant.city,
            "state": restaurant.state
        }
        restaurants_list.append(restaurant_dict)

       
    
    return jsonify(restaurants_list)

@app.route("/api/v1.0/cuisine_distribution")
def cuisine_distribution():
    state = request.args.get('state', type=str)
    price = request.args.get('price',type=str)
    rating = request.args.get('rating',type=float)
 
    
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Joining cuisine and metadata tables and getting cuisines of restaurants.
    query = session.query(Cuisine.cuisines.label('cuisine'),func.count(Metadata.id).label('count')).join(
        Cuisine, Metadata.id==Cuisine.id
    )
    if state:
        query=query.filter(Metadata.state==state)
    if price:
        query=query.filter(Metadata.price==price)
    if rating:
        query=query.filter(Metadata.rating>=rating)
    query = query.group_by(Cuisine.cuisines).order_by(desc('count'))
    
    
    cuisine_group = query.all()

    # query to get total count
    query = session.query(func.count(Metadata.id).label('total'))
    if state:
        query=query.filter(Metadata.state==state)
    if price:
        query=query.filter(Metadata.price==price)
    if rating:
        query=query.filter(Metadata.rating>=rating)
    
    total = query.one()[0]
    print(total)
    
    session.close()
    cuisine_group_list = []
    for c in cuisine_group:
        cuisine_dict = {
           "cuisine": c.cuisine,
            "count": c.count,
            "percentage": round((c.count / total) * 100, 1 )
        }
        cuisine_group_list.append(cuisine_dict)

       
    
    return jsonify(cuisine_group_list)

@app.route("/api/v1.0/price_rating")
def price_rating():
    state = request.args.get('state', type=str)
    cuisine = request.args.get('cuisine', type=str)

    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Getting price and ratings
    query = session.query(Metadata.price,Metadata.rating,func.count(Metadata.id).label('count'))

    if cuisine:
        query=query.join(Cuisine, Metadata.id==Cuisine.id).filter(
            Cuisine.cuisines==cuisine
            )
    if state:
        query=query.filter(Metadata.state==state)
    
    query = query.group_by(Metadata.price,Metadata.rating).order_by(Metadata.price)

    result = query.all()
    
    session.close()
    price_rating_list = []
    for pr in result:
        cuisine_dict = {
           "price": "Unknown" if pr.price==None else pr.price,
           "rating": pr.rating,
           "count": pr.count,
        }
        price_rating_list.append(cuisine_dict)

       
    
    return jsonify(price_rating_list)



if __name__ == "__main__":
    app.run(debug=True)
