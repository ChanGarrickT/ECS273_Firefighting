import * as d3 from "d3";
import { useEffect } from "react";
import FireBarChart from "./fireBarChart";

export default function PredictionForm(props){
    // Make an initial prediction with default values
    useEffect(() => {
        callModel();
    }, []);

    // Make request when button is clicked
    function callModel(){
        const payload = {
            fires: parseInt(d3.select("#prev-mon-input").property("value")),
            temperature: parseFloat(d3.select("#temp-input").property("value")),
            precipitation: parseFloat(d3.select("#precip-input").property("value")),
            PSDI: parseFloat(d3.select("#drought-input").property("value"))
        }
        props.makePredictions(payload);
    }

    return (
        <div className="flex flex-row h-full">
            <div className="border-2 border-gray-300 rounded-xl w-3/5 h-full mr-2">
                <div className="flex flex-col w-full h-full m-auto">
                    <div className="flex flex-row m-3 h-2/3">
                        <div id="form-col-1" className="flex flex-col w-1/2 mr-8">
                            <div className="flex flex-row align-center mb-3 h-1/2">
                                <label htmlFor="prev-mon-input" className="text-sm text-black mr-5 my-auto w-7/10">Fires in Previous Month</label>
                                <input type="number" id="prev-mon-input" className="w-3/10 p-2 text-black text-l border border-green-700 rounded-lg" defaultValue="0" min="0"/>
                            </div>
                            <div className="flex flex-row align-center h-1/2">
                                <label htmlFor="temp-input" className="text-sm text-black mr-5 my-auto w-7/10">Temperature (ºF)</label>
                                <input type="number" id="temp-input" className="w-3/10 p-2 text-black text-l border border-green-700 rounded-lg" defaultValue="85" step="any"/>
                            </div>
                        </div>
                        <div id="form-col-2" className="flex flex-col w-1/2 ml-8">
                            <div className="flex flex-row align-center mb-3 h-1/2">
                                <label htmlFor="precip-input" className="text-sm text-black mr-5 my-auto w-7/10">Precipitation (in.)</label>
                                <input type="number" id="precip-input" className="w-3/10 p-2 text-black text-l border border-green-700 rounded-lg" defaultValue="0" min="0" step="any"/>
                            </div>
                            <div className="flex flex-row align-center h-1/2">
                                <label htmlFor="drought-input" className="text-sm text-black mr-5 my-auto w-7/10">Drought Index</label>
                                <input type="number" id="drought-input" className="w-3/10 p-2 text-black text-l border border-green-700 rounded-lg" defaultValue="0" step="any"/>
                            </div>
                        </div>                                              
                    </div>
                    <button id="submit-button" type="submit" className="bg-green-700 text-white text-3xl w-1/2 h-1/3 mx-auto my-3 rounded-lg" onClick={callModel}>Predict</button>
                </div>
            </div>
            <div className="border-2 border-gray-300 rounded-xl w-2/5 h-full ml-2">
                <div className="flex flex-col w-full h-full">
                    <FireBarChart {...props} feature="Fires" />
                    <p className="text-xs text-center p-1">Predicted Number of Fires</p>
                </div>
            </div>
        </div>
    )
}