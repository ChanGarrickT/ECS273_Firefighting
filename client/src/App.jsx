import { useEffect, useState, useRef } from "react";
import CaliMap from "./components/map";
import Menus from "./components/menus";
import IncidentLabel from "./components/incidentLabel";
import WeatherData from "./components/weather";
import DamageData from "./components/damages";
import ChoicesList from "./components/choicesList";
import PredictionForm from "./components/predictionForm";

const MAX_INCIDENTS = 5;

export default function App(){
    // Track the view mode
    const [mode, setMode] = useState("History");
    const modeRef = useRef(mode);
    // Reset settings for history mode when the mode is changed
    useEffect(() => {    
        modeRef.current = mode;
        setYearMonth({year: "None", month: "None"});
        setFilter("YrMo");
        setSelectedCounty("None");
        setSelectedIncidents([]);
        setSelectedPredictions([]);
    }, [mode]);   
    const changeMode = (e) => setMode(e.target.value);

    // Track the filter mode
    const [filter, setFilter] = useState("YrMo");
    const filterRef = useRef(filter);
    useEffect(() => {
        filterRef.current = filter;
    }, [filter]);

    // Track the selected year and month
    const [selectedYearMonth, setYearMonth] = useState({year: "None", month: "None"})
    const selectedYearMonthRef = useRef(selectedYearMonth);
    useEffect(() => {
        selectedYearMonthRef.current = selectedYearMonth;
    }, [selectedYearMonth]);

    // Track the selected incidents
    const [selectedIncidents, setSelectedIncidents] = useState([]);
    const selectedIncidentsRef = useRef(selectedIncidents);
    useEffect(() => {
        selectedIncidentsRef.current = selectedIncidents;
    }, [selectedIncidents]);

    // Track the selected county
    const [selectedCounty, setSelectedCounty] = useState("None");
    const selectedCountyRef = useRef(selectedCounty);
    useEffect(() => {
        selectedCountyRef.current = selectedCounty;
    }, [selectedCounty]);

    // Track predictions
    const [predictions, setPredictions] = useState({});
    const predictionsRef = useRef(predictions);
    useEffect(() => {
        predictionsRef.current = predictions
    }, [predictions]);

    // Track selected counties for predictions
    const [selectedPredictions, setSelectedPredictions] = useState([]);

    // Add an incident to compare
    async function addIncident(input){
        try{
            await fetch(`http://localhost:8000/history?year=${input.year}&month=${input.month}&county=${input.County}`)
                .then((res) => res.json())
                .then((data) => {            
                    const incident = data[0];
                    const incidentWithData = {
                        ...input,
                        AcresBurned: incident.AcresBurned,
                        Injuries: incident.Injuries,
                        Fatalities: incident.Fatalities,
                        StructuresDestroyed: incident.StructuresDestroyed,
                        StructuresDamaged: incident.StructuresDamaged,
                        PropetyValue_Damage: incident.PropetyValue_Damage,
                        Drought_Index: incident.Drought_Index,
                        Precipitation: incident.Precipitation,
                        Temperature: incident.Temperature,
                        Heating_Degree_Days: incident.Heating_Degree_Days,
                        Cooling_Degree_Days: incident.Cooling_Degree_Days
                    }
                    addIncidentHelper(incidentWithData);
                })
        } catch(error){
            console.error("Error fetching: ", error);
        }
    }

    // Set state of incident list; this can"t be done in the same function as fetching
    function addIncidentHelper(incident){
        setSelectedIncidents((prev) => {
            if(prev.length >= MAX_INCIDENTS){
                return prev;
            }
            for(let i = 0; i < prev.length; i++){
                if(incident.year === prev[i].year && incident.month === prev[i].month && incident.County === prev[i].County){
                    return prev;                
                }
            }
            return [...prev, incident];
        })
    }

    // Remove an incident from tracking
    function removeIncident(index){
        setSelectedIncidents((prev) => {
            if(index >= 0 && index <= prev.length){
                const tmp = [...prev];
                tmp.splice(index, 1);
                return tmp;
            } else {
                return prev;
            }
        })
    }

    // Send a request to the model
    async function makePredictions(input){
        fetch("http://localhost:8000/predict/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)})
                .then((res) => res.json())
                .then((data) => { 
                    setPredictions(data.predictions);
            }
        )    
    }

    // Add a county to the list of prediction comparisons
    function addPrediction(county){
        let toAdd = null;
        for(let i = 0; i < predictionsRef.current.length; i++){
            if(predictionsRef.current[i].County === county){
                toAdd = predictionsRef.current[i];
                break;
            }
        }
        setSelectedPredictions((prev) => {
            if(prev.length >= MAX_INCIDENTS){
                return prev;
            }
            for(let i = 0; i < prev.length; i++){
                if(county === prev[i].County){
                    return prev;
                }
            }
            return [...prev, toAdd];
        })
    }

    // Remove a county to the list of prediction comparisons
    function removePrediction(index){
        setSelectedPredictions((prev) => {
            if(index >= 0 && index <= prev.length){
                const tmp = [...prev];
                tmp.splice(index, 1);
                return tmp;
            } else {
                return prev;
            }
        })
    }

    // Update selected comparisons if a new prediction is made
    useEffect(() => {
        setSelectedPredictions((prev) => {
            let newList = [];
            for(let s = 0; s < prev.length; s++){
                for(let c = 0; c < predictions.length; c++){
                    if(predictions[c].County === prev[s].County){
                        newList.push(predictions[c]);
                        break;
                    }
                }
            }
            return newList;
        })
    }, [predictions])

    // Variables and functions to pass to menus
    const menuProps = {
        mode: mode,
        modeRef: modeRef,
        filter: filter,
        selectedYearMonth: selectedYearMonth,
        selectedCounty: selectedCounty,
        setFilter: setFilter,
        setYearMonth: setYearMonth,
        setSelectedCounty: setSelectedCounty
    }

    // Variables and functions to pass to the map and selector column
    const mapProps = {
        mode: mode,
        filter: filter,
        selectedYearMonth: selectedYearMonth,
        selectedCounty: selectedCounty,
        setSelectedCounty: setSelectedCounty,
        addIncident: (incident) => addIncident(incident),
        addPrediction: addPrediction
    };

    // Variables and functions to pass to the incident labels
    const labelProps = {
        modeRef: modeRef,
        selectedIncidents: selectedIncidents,
        selectedPredictions: selectedPredictions,
        removeIncident: removeIncident,
        removePrediction: removePrediction
    };

    // Variables to pass to the prediction form
    const formProps = {
        predictions: predictions,
        makePredictions: makePredictions
    }

    return(
        <div className="flex flex-col h-full w-full">
            <header className="bg-green-700 text-white p-4 flex flex-row align-center">
                <h2 className="text-left text-2xl">Wildfire Risk Predictor</h2>
                <label htmlFor="bar-select" className="mx-5">Select View Mode:
                    <select id="bar-select" className="bg-white text-black text-xl p-2 rounded mx-2" onChange={changeMode}>
                        <option value="History">History</option>
                        <option value="Prediction">Prediction</option>
                    </select>
                </label>
            </header>
            <div className="flex flex-row h-3/4 w-39/40 m-auto"> {/* Main container */}
                <div className="flex-col w-3/8 h-full p-2"> {/* Left container */}
                    <div className="flex flex-row map-top align-center"> {/* Menu container */}
                        {mode === "History" ? <Menus.HistoryMenus {...menuProps}/> : <div className="text-xl h-[2rem]">View Predictions by County</div>}
                    </div>
                    <div className="flex flew-row w-full h-[calc(100%_-_2rem)]"> {/* Map and selector container */}
                        <div className="border-2 border-gray-300 rounded-xl w-5/7 h-full mr-2">
                            <CaliMap {...mapProps}/>
                        </div>
                        <div className="border-2 border-gray-300 rounded-xl w-2/7 h-full ml-2">
                            <ChoicesList {...mapProps}/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-5/8"> {/* Data container */}
                    <div className="incidents-container h-[2rem]">
                        <IncidentLabel {...labelProps}/>
                    </div>
                    <div className="h-[calc(50%_-_1rem)] p-2">
                        {mode === "History" ? <WeatherData data={selectedIncidents}/> : <PredictionForm {...formProps} data={selectedPredictions}/>}
                    </div>
                    <div className="h-[calc(50%_-_1rem)] p-2">
                        <div className="border-2 border-gray-300 rounded-xl h-full">
                            <DamageData data={mode === "History" ? selectedIncidents : selectedPredictions} predictions={mode === "Prediction" ? predictions : null}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
