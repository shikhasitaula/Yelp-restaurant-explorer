from flask import Flask, jsonify, render_template
from flask_cors import CORS
from sqlalchemy import create_engine, func 
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker
import ast
import json

app = Flask(__name__)
CORS(app)

engine = create_engine("sqlite:///restaurants.db")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

print(Base.classes.keys())

# Save references to each table
RestaurantMetadata = Base.classes.restaurant_metadata
States = Base.classes.states

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/api/v1/states")
def get_unique_states():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Find the most recent date in the data set.
    query = session.query(States.state, States.alias) \
        .join(RestaurantMetadata, States.alias == RestaurantMetadata.state) \
        .distinct()
    
    unique_states = query.all()
    session.close()
  
    state_list = []
    for state, alias in unique_states:
        state_dict = {}
        state_dict["name"] = state
        state_dict["alias"] = alias
        
        state_list.append(state_dict)

    return jsonify(state_list)

@app.route('/api/v1/cuisines/<state>')
def get_cusines(state):
    session = Session(engine)
    
    # Find the most recent date in the data set.
    query = session.query(RestaurantMetadata.cuisines) \
        .join(States, States.alias == RestaurantMetadata.state) \
        .filter(States.alias == state) \
        .all()
    
    session.close()
       
    cuisines = {} 
    for row in query:
        for cuisine in row[0].split(','):
            if cuisine in cuisines:
                cuisines[cuisine] += 1
            else:
                cuisines[cuisine] = 1
    
    # Only return top 10 cuisines
    result = []
    for key, value in cuisines.items():
         result.append({"name": key, "count": value})
    
    sorted_data = sorted(result, key=lambda x: x['count'], reverse=True)
    
    return jsonify(sorted_data[0:20])

@app.route('/api/v1/restaurants/<state>')
@app.route('/api/v1/restaurants/<state>/<cuisine>')
def get_restaurants(state, cuisine=None):
    session = Session(engine)
    
    # Find the most recent date in the data set.
    query = session.query(RestaurantMetadata) \
        .join(States, States.alias == RestaurantMetadata.state) \
        .filter(States.alias == state)
    
    if cuisine:
        query = query.filter(RestaurantMetadata.cuisines.like(f'%{cuisine}%'))
        
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
            "coords": [restaurant.latitude, restaurant.longitude],
            "city": restaurant.city,
            "image": restaurant.image_url,
            'address': restaurant.location
        }
        restaurants_list.append(restaurant_dict)
    return jsonify(restaurants_list)
    
@app.route("/api/v1/price-rating/<state>")    
@app.route("/api/v1/price-rating/<state>/<cuisine>")
def price_rating(state,cuisine=None):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Getting price and ratings
    query = session.query(RestaurantMetadata.price,
                          RestaurantMetadata.rating,
                          func.count(RestaurantMetadata.id).label('count')
                          ).join(States, States.alias == RestaurantMetadata.state).filter(States.alias == state) 
    if cuisine:
        query = query.filter(RestaurantMetadata.cuisines.like(f'%{cuisine}%'))
        
    query = query.group_by(
        RestaurantMetadata.price,RestaurantMetadata.rating
        ).order_by(RestaurantMetadata.price)
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