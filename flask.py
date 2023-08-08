import sqlalchemy
from sqlalchemy import create_engine, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

from flask import Flask, jsonify
# Database Setup
engine = create_engine("sqlite:///Resources/restaurants.db")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)
# 
print(Base.classes.keys())

# # Save references to each table
Metadata = Base.classes.restaurant_metadata
Cuisine = Base.classes.restaurant_cuisine

# Flask Setup
app = Flask(__name__)
# Flask Routes

@app.route("/api/v1.0/state")
def prcp():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Find the most recent date in the data set.
    unique_states = session.query(Metadata.states).distinct().all()
    session.close()
    # Convert the result into a list of state values
    list = [state[0] for state in unique_states]

    # return jsonify(prcp)
    unique_states_list = []
    for state, p in list:
        states_dict = {} 
        unique_states_list.append(states_dict)

    return jsonify(unique_states_list)

if __name__ == "__main__":
    app.run(debug=True)
# session = Session(engine)
# query = session.query(Metadata.id, Metadata.name) .filter(Metadata.state == 'CA')
# results = query.all()
# session.close()
# print(results)