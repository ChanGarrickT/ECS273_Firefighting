import { useState } from "react";

function App(){
    const [mode, setMode] = useState('History')
    const changeMode = (e) => setMode(e.target.value)

    return(
        <div className="flex flex-col h-full w-full">
            <header className="bg-green-700 text-white p-4 flex flex-row align-center">
                <h2 className="text-left text-2xl">Wildfire Risk Predictor</h2>
                <label htmlFor="bar-select" className="mx-5">Select View Mode:
                    <select id="bar-select" className="bg-white text-black p-2 rounded mx-2" onChange={changeMode}>
                        <option value="History">History</option>
                        <option value="Prediction">Prediction</option>
                    </select>
                </label>
            </header>
            <div className="flex flex-row h-3/4 w-3/4 m-auto"> {/* Main container */}
                <div className="w-1/2"> {/* Map container */}
                    <h3>Map</h3>
                    <div className="border-2 border-gray-300">
                        
                    </div>
                </div>
                <div className="flex flex-col w-1/2"> {/* Data container */}
                    <div className="h-1/3 p-2">
                        <h3>Weather Data</h3>
                        <div className="border-2 border-gray-300">
                            
                        </div>
                    </div>
                    <div className="h-2/3 p-2">
                        <h3>Damage Data</h3>
                        <div className="border-2 border-gray-300">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
