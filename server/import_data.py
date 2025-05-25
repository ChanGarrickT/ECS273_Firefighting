import os
import pandas as pd
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

# MongoDB connection (localhost, default port)
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.wildfire_history


history = db.get_collection("wildfire_history")
async def import_wildfire_history():
    # Insert tsne data into the collection
    data = []
    with open("History_County_Weather.csv", encoding='utf-8') as file:
        data = file.readlines()

    data_json = []
    for d in data[1:]:
        d = d.rstrip('\n').split(',')
        tmp = {
                "Started": str(d[0]),
                "County": str(d[1]),
                "AcresBurned": float(d[2]),
                "Injuries": float(d[3]),
                "Fatalities": float(d[4]),
                "StructuresDestroyed": float(d[5]),
                "StructuresDamaged": float(d[6]),
                "PropetyValue_Damage": float(d[7]),
                "Drought_Index": float(d[8]),
                "Precipitation": float(d[9]),
                "Temperature": float(d[10]),
                "Heating_Degree_Days": float(d[11]),
                "Cooling_Degree_Days": float(d[12]),

        }

        data_json.append(tmp)
    await history.insert_many(data_json)

async def main():
    await import_wildfire_history()


if __name__ == "__main__":
    asyncio.run(main())

