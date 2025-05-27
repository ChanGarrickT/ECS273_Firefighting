import * as d3 from "d3";
import { useEffect, useState } from "react";
import CaliMap from "./components/map";
import TimeSelector from "./components/timeSelect";
import IncidentLabel from "./components/incidentLabel";
import WeatherData from "./components/weather";
import { forEach } from "lodash";

export default function App(){
    const [mode, setMode] = useState('History');
    const changeMode = (e) => setMode(e.target.value);

    const [historyData, setHistoryData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8000/history")
            .then((res) => res.json())
            .then((data) => setHistoryData(data));
    }, []);

    const [selectedYearMonth, setYearMonth] = useState({year: 'None', month: 'None'})
    useEffect(() => {
        const result = [];
        d3.selectAll('.county-geo').classed('county-geo-incident', false);
        if (selectedYearMonth.year !== 'None' && selectedYearMonth.month !== 'None'){
            historyData.forEach((incident) => {
                if(incident.Started === selectedYearMonth.year + selectedYearMonth.month){
                    d3.select(`#county-geo-${incident.County}`).classed('county-geo-incident', true);            
                }
            })
        }
    }, [historyData, selectedYearMonth])

    const [selectedCounties, setSelectedCounties] = useState([]);
    const [selectedIncidents, setSelectedIncidents] = useState([]);

    function addIncident(incident){
        setSelectedIncidents((prev) => {
            if(prev.length >= 3){
                return prev;
            }
            for(let i = 0; i < prev.length; i++){
                if(incident.year === prev[i].year && incident.month === prev[i].month && incident.county === prev[i].county){
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

    const mapProps = {
        selectedCounties: selectedCounties,
        selectCounties: (counties) => setSelectedCounties(counties),
        selectedIncidents: selectedIncidents,
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
            <div className="flex flex-row h-3/4 w-9/10 m-auto"> {/* Main container */}
                <div className="flex-col w-2/5 h-full p-2"> {/* Map container */}
                    {/* <h3 className="text-left text-xl h-[2rem]">Map</h3> */}
                    <div className="flex flex-row map-top align-center">
                        <h3 className="text-left text-xl h-[2rem]">{mode === "History" ? "Select Year & Month, then County" : "Select County"}</h3>
                        {mode === "History" ? <TimeSelector setTime={setYearMonth}/> : null}
                    </div>
                    <div className="border-2 border-gray-300 rounded-xl h-[calc(100%_-_2rem)]">
                        <CaliMap {...mapProps}/>
                    </div>
                </div>
                <div className="flex flex-col w-3/5"> {/* Data container */}
                    <div className="incidents-container h-[2rem]">
                        <IncidentLabel {...mapProps}/>
                    </div>
                    <div className="h-[calc(50%_-_1rem)] p-2">
                        <div className="border-2 border-gray-300 rounded-xl h-full">
                            <WeatherData />
                        </div>
                    </div>
                    <div className="h-[calc(50%_-_1rem)] p-2">
                        <div className="border-2 border-gray-300 rounded-xl h-full">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
