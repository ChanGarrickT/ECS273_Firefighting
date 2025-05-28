from fastapi import FastAPI
from pydantic.functional_validators import BeforeValidator
from motor.motor_asyncio import AsyncIOMotorClient

from fastapi.middleware.cors import CORSMiddleware

from data_scheme import WildfireDataModel

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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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