import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import FireBarChart from "./fireBarChart";

export default function PredictionForm(props){
    return (
        <div className="flex flex-row h-full">
            <div className="border-2 border-gray-300 rounded-xl w-3/4 h-full mr-2">
                <form className="max-w-sm mx-auto">
                    <div className="flex flex-row align-center mb-5">
                        <label htmlFor="large-input" className="text-sm text-black mr-5 mt-2.5">Fires in Previous Month</label>
                        <input type="number" id="prev-mon-input" className="w-1/2 p-2 text-black text-l border border-green-700 rounded-lg" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-black">Temperature</label>
                        <input type="number" id="temp-input" className="block w-full p-2 text-black text-xl border border-green-700 rounded-lg" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-black">Precipitation</label>
                        <input type="number" id="precip-input" className="block w-full p-2 text-black text-xl border border-green-700 rounded-lg" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-black">Drought Index</label>
                        <input type="number" id="drought-input" className="block w-full p-2 text-black text-xl border border-green-700 rounded-lg" />
                    </div>
                </form>
            </div>
            <div className="border-2 border-gray-300 rounded-xl w-1/4 h-full ml-2">
                <form className="max-w-sm mx-auto">
                    <FireBarChart {...props} />
                </form>
            </div>
        </div>
    )
}