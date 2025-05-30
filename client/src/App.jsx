import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";
import CaliMap from "./components/map";
import Menus from "./components/menus";
import IncidentLabel from "./components/incidentLabel";
import WeatherData from "./components/weather";
import DamageData from "./components/damages";
import { forEach } from "lodash";
import ChoicesList from "./components/choicesList";
import PredictionForm from "./components/predictionForm";

export default function App(){
    const [mode, setMode] = useState('History');
    const modeRef = useRef(mode);
    useEffect(() => {    
        modeRef.current = mode;
        d3.selectAll('.county-geo').classed('county-geo-incident', false);
        d3.selectAll('.county-choice').remove();
        setYearMonth({year: 'None', month: 'None'});
        setSelectedCounty('None');
        setSelectedIncidents([]);
    }, [mode]);   
    const changeMode = (e) => setMode(e.target.value);

    const [filter, setFilter] = useState('YrMo');
    const filterRef = useRef(filter);
    useEffect(() => {
        filterRef.current = filter;
    }, [filter]);

    const [selectedYearMonth, setYearMonth] = useState({year: 'None', month: 'None'})
    const selectedYearMonthRef = useRef(selectedYearMonth);
    useEffect(() => {
        selectedYearMonthRef.current = selectedYearMonth;
    }, [selectedYearMonth]);

    const [selectedIncidents, setSelectedIncidents] = useState([]);
    const selectedIncidentsRef = useRef(selectedIncidents);
    useEffect(() => {
        selectedIncidentsRef.current = selectedIncidents;
    }, [selectedIncidents]);

    const [selectedCounty, setSelectedCounty] = useState('None');
    const selectedCountyRef = useRef(selectedCounty);
    useEffect(() => {
        selectedCountyRef.current = selectedCounty;
    }, [selectedCounty]);

    async function addIncident(input){
        try{
            await fetch(`http://localhost:8000/history?year=${input.year}&month=${input.month}&county=${input.countyName}`)
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
            console.error('Error fetching: ', error);
        }
    }

    function addIncidentHelper(incident){
        setSelectedIncidents((prev) => {
            if(prev.length >= 3){
                return prev;
            }
            for(let i = 0; i < prev.length; i++){
                if(incident.year === prev[i].year && incident.month === prev[i].month && incident.countyName === prev[i].countyName){
                    return prev;                
                }
            }
            return [...prev, incident];
        })
    }

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

    const menuProps = {
        mode: mode,
        modeRef: modeRef,
        filter: filter,
        filterRef: filterRef,
        selectedYearMonth: selectedYearMonth,
        selectedCounty: selectedCounty,
        setFilter: setFilter,
        setYearMonth: setYearMonth,
        setSelectedCounty: setSelectedCounty
    }

    const mapProps = {
        mode: mode,
        modeRef: modeRef,
        filter: filter,
        filterRef: filterRef,
        selectedYearMonth: selectedYearMonth,
        selectedYearMonthRef: selectedYearMonthRef,
        selectedCounty: selectedCounty,
        selectedCountyRef: selectedCountyRef,
        selectedIncidents: selectedIncidents,
        setSelectedCounty: setSelectedCounty,
        addIncident: (incident) => addIncident(incident),
        removeIncident: (index) => removeIncident(index)
    };

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
            <div className="flex flex-row h-3/4 w-19/20 m-auto"> {/* Main container */}
                <div className="flex-col w-3/7 h-full p-2"> {/* Map container */}
                    {/* <h3 className="text-left text-xl h-[2rem]">Map</h3> */}
                    <div className="flex flex-row map-top align-center">
                        {mode === 'History' ? <Menus.HistoryMenus {...menuProps}/> : null}
                        {/* <h3 className="text-left text-xl h-[2rem]">{mode === "History" ? "Select Year & Month, then County" : "Select County"}</h3> */}
                        {/* {mode === "History" ? <Menus.TimeSelector setTime={setYearMonth}/> : null} */}
                    </div>
                    <div className="flex flew-row w-full h-[calc(100%_-_2rem)]">
                        <div className="border-2 border-gray-300 rounded-xl w-5/7 h-full mr-2">
                            <CaliMap {...mapProps}/>
                        </div>
                        <div className="border-2 border-gray-300 rounded-xl w-2/7 h-full ml-2">
                            <ChoicesList {...mapProps}/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-4/7"> {/* Data container */}
                    <div className="incidents-container h-[2rem]">
                        <IncidentLabel {...mapProps}/>
                    </div>
                    <div className="h-[calc(50%_-_1rem)] p-2">
                        <div className="border-2 border-gray-300 rounded-xl h-full">
                            {mode === 'History' ? <WeatherData {...mapProps} data={selectedIncidents}/> : <PredictionForm />}
                        </div>
                    </div>
                    <div className="h-[calc(50%_-_1rem)] p-2">
                        <div className="border-2 border-gray-300 rounded-xl h-full">
                            <DamageData {...mapProps} data={selectedIncidents}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
