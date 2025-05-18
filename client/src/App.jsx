import { useEffect, useState } from "react";
import CaliMap from "./components/map";

export default function App(){
    const [mode, setMode] = useState('History');
    const changeMode = (e) => setMode(e.target.value);

    const [currentCounty, setCurrentCounty] = useState('');
    useEffect(() => {
        // if(currentCounty !== ''){
        //     alert(currentCounty); 
        // }
    }, [currentCounty]) 

    const mapProps = {
        getCurrentCounty: (county) => {
            setCurrentCounty(county);                 
        }
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
            <div className="flex flex-row h-3/4 w-3/4 m-auto"> {/* Main container */}
                <div className="w-3/5 h-full p-2"> {/* Map container */}
                    {/* <h3 className="text-left text-xl h-[2rem]">Map</h3> */}
                    <div className="border-2 border-gray-300 rounded-xl h-full">
                        <CaliMap {...mapProps}/>
                    </div>
                </div>
                <div className="flex flex-col w-2/5"> {/* Data container */}
                    <div className="h-1/3 p-2">
                        <h3 className="text-left text-xl h-[2rem]">Weather Data for {currentCounty}</h3>
                        <div className="border-2 border-gray-300 rounded-xl h-[calc(100%_-_2rem)]">
                            
                        </div>
                    </div>
                    <div className="h-2/3 p-2">
                        <h3 className="text-left text-xl h-[2rem]">Damage Data for {currentCounty}</h3>
                        <div className="border-2 border-gray-300 rounded-xl h-[calc(100%_-_2rem)]">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
