from flask import Flask, render_template, redirect
import sqlalchemy as db
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import text
import json

app = Flask(__name__)
Base = declarative_base()
engine = db.create_engine("database path")
conn = engine.connect()
session = Session(bind=engine)

@app.route("api/v1/states")
# this api should return distinct states as list

# @app.route("/api/v1/<state>/cities") 
# #  this api should return all the cities in provided state as list

@app.route("/api/v1/<state>/<city>/cuisines")
#  this api should return all the cuisines in that city as list

@app.route("/api/v1/<state>/<city>/<cuisine>/restaurants")
#  this api should return all the restaurants for selected cuisine as list of dictionaries.

if __name__ == "__main__":
    app.run(debug=True)