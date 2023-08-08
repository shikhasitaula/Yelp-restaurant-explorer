import sqlalchemy
from sqlalchemy import create_engine, func
# import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

# from datetime import datetime as dt, timedelta

# from flask import Flask, jsonify
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

session = Session(engine)
query = session.query(Metadata.id, Metadata.name) .filter(Metadata.state == 'CA')
results = query.all()
session.close()
print(results)