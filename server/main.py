from fastapi import FastAPI
from pydantic.functional_validators import BeforeValidator
from motor.motor_asyncio import AsyncIOMotorClient

from fastapi.middleware.cors import CORSMiddleware

from data_scheme import WildfireDataModel

import pickle
import numpy as np
from pydantic import BaseModel

from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler

# MongoDB connection (localhost, default port)
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.wildfire_history # please replace the database name with stock_[your name] to avoid collision at TA's side



app = FastAPI(
    title="Wildfire API",
    summary="An application visualizing & predicting wildfire"
)

# Enables CORS to allow frontend apps to make requests to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("./models/firePredictor.pkl", "rb") as f:
    lr = pickle.load(f)
with open("./models/x_scaler.pkl", "rb") as f:
    x_scaler = pickle.load(f)
with open("./models/y_scaler.pkl", "rb") as f:
    y_scaler = pickle.load(f)
with open("./models/countyPredictor.pkl", "rb") as f:
    county_fires_model = pickle.load(f)
with open("./models/all_damages.pkl", "rb") as f:
    total_dmg_model = pickle.load(f)
with open("./models/county_damages.pkl", "rb") as f:
    county_damage_model = pickle.load(f)


class InputData(BaseModel):
    fires: int
    temperature: float
    precipitation: float
    PSDI: float

@app.get("/history/",
        response_model=list[WildfireDataModel]
    )
async def get_history(year = None, month = None, county = None) -> WildfireDataModel:
    """
    Get the historic wildfire data 
    """
    query = {}
    if year is not None:
        query['Started'] = {'$regex':f"^{year}"}
    if month is not None:
        if 'Started' in query:
            query['Started']['$regex'] += month + "$"
        else: 
            query['Started'] = {'$regex':f"{month}$"}
    if county is not None:
        query['County'] = county
    history_collection = db.get_collection("wildfire_history")
    history_data = await history_collection.find(query).to_list(length=None)
    return history_data


damageMods = [8249.457,	0.462,	0.199,	52.382,	5.015,	28183.454]
@app.post('/predict/')
def predict(data: InputData):
    x_rescaled = x_scaler.transform([[data.fires, data.temperature, data.precipitation, data.PSDI]])
    y_rescaled = lr.predict(x_rescaled)
    totalFires = y_scaler.inverse_transform(y_rescaled)[0][0]
    totalFires = np.round(totalFires).astype(int)

    predictions = []
    for county in county_fires_model:

        fires = county_fires_model[county] * totalFires
        fires = int(round(fires))
        
        countyObj = {
            'County': county,
            'Fires': fires,
            'AcresBurned':  int(round(fires * damageMods[0])),
            'Injuries':  int(round(fires * damageMods[1])),
            'Fatalities':  int(round(fires * damageMods[2])),
            'StructuresDestroyed':  int(round(fires * damageMods[3])),
            'StructuresDamaged':  int(round(fires * damageMods[4])),
            'PropetyValue_Damage':  int(round(fires * damageMods[5]))
        }

        predictions.append(countyObj)
    return {"predictions": predictions}

