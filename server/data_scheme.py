from typing import Optional, List, Annotated
from pydantic import BaseModel
from pydantic.functional_validators import BeforeValidator
from bson import ObjectId

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.

PyObjectId = Annotated[str, BeforeValidator(str)]


class WildfireDataModel(BaseModel):
    """
    Model for wildfire history
    """
    _id: PyObjectId
    Started: str
    County: str
    AcresBurned: float
    Injuries: float
    Fatalities: float
    StructuresDestroyed: float
    StructuresDamaged: float
    PropetyValue_Damage: float
    Drought_Index: float
    Precipitation: float
    Temperature: float
    Heating_Degree_Days: float
    Cooling_Degree_Days: float
