# from flask import Flask, render_template, redirect, jsonify, g
# # from sqlalchemy import create_engine
# import sqlalchemy as db
# from sqlalchemy.orm import create_engine, func, Session, sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.sql import text
# import json

# # Create an instance of Flask
# app = Flask(__name__)

# # Create an engine to connect to the database
# engine = create_engine("sqlite:///restaurants.db")

# # Reflect the tables
# Base = automap_base()
# Base.prepare(engine, reflect=True)
# restaurant_metadata = Base.classes.restaurant_metadata

# # Create a session factory
# Session = sessionmaker(bind=engine)

# # Function to get or create a session


# def get_session():
#     if 'session' not in g:
#         # Create a new session if it doesn't exist
#         g.session = Session()
#     return g.session


# # Close the session at the end of each request
# @app.teardown_appcontext
# def teardown_session(exception=None):
#     session = g.pop('session', None)
#     if session is not None:
#         session.close()

# # Define the home route


# @app.route("/")
# def home():
#     return (
#         f"Welcome to cuisine explorer App API!<br/>"
#         f"Available Routes:<br/>"
#         f"/api/v1.0/states<br/>"
#         # f"/api/v1.0/stations<br/>"
#         # f"/api/v1.0/tobs<br/>"
#         # f"/api/v1.0/&lt;start&gt;<br/>"
#         # f"/api/v1.0/&lt;start&gt;/&lt;end&gt;"
#     )

# # Define the state route


# @app.route("/api/v1.0/states")
# def states():
#     session = get_session()
#     states = session.query(restaurant_metadata.state).distinct()


# if __name__ == "__main__":
#     app.run(debug=True)


# # # Create an instance of Flask
# # app = Flask(__name__)
# # Base = declarative_base()
# # engine = db.create_engine("database path")
# # conn = engine.connect()
# # session = Session(bind=engine)

# # @app.route("api/v1/states")
# # # this api should return distinct states as list

# # # @app.route("/api/v1/<state>/cities")
# # # #  this api should return all the cities in provided state as list

# # @app.route("/api/v1/<state>/<city>/cuisines")
# # #  this api should return all the cuisines in that city as list

# # @app.route("/api/v1/<state>/<city>/<cuisine>/restaurants")
# # #  this api should return all the restaurants for selected cuisine as list of dictionaries.

# # if __name__ == "__main__":
# #     app.run(debug=True)

from flask import Flask, jsonify
# from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, redirect, jsonify, g
# from sqlalchemy import create_engine
import sqlalchemy as db
from sqlalchemy.orm import create_engine, func, Session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.sql import text
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
db = SQLAlchemy(app)


class State(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)


class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('state.id'), nullable=False)
    state = db.relationship('State', backref=db.backref('cities', lazy=True))


class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), nullable=False)
    city = db.relationship(
        'City', backref=db.backref('restaurants', lazy=True))

# Route to get a list of states


@app.route('/states', methods=['GET'])
def get_states():
    states = State.query.all()
    state_names = [state.name for state in states]
    return jsonify(state_names)

# Route to get a list of cities and their corresponding restaurants for a given state


@app.route('/cities/<state_name>', methods=['GET'])
def get_cities(state_name):
    state = State.query.filter_by(name=state_name).first()
    if state:
        cities = state.cities
        city_names = [city.name for city in cities]
        return jsonify({"state": state_name, "cities": city_names})
    else:
        return jsonify({"error": "State not found"}), 404

# Route to get a list of restaurants for a given city


@app.route('/restaurants/<city_name>', methods=['GET'])
def get_restaurants(city_name):
    city = City.query.filter_by(name=city_name).first()
    if city:
        restaurants = city.restaurants
        restaurant_names = [restaurant.name for restaurant in restaurants]
        return jsonify({"city": city_name, "restaurants": restaurant_names})
    else:
        return jsonify({"error": "City not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
