import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function PredictionForm(props){
    return (
        <div>
            <form className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-black">First Param</label>
                    <input type="text" id="large-input" className="block w-full p-2 text-black text-xl border border-green-700 rounded-lg" />
                </div>
                <div className="mb-5">
                    <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-black">Second Param</label>
                    <input type="text" id="large-input" className="block w-full p-2 text-black text-xl border border-green-700 rounded-lg" />
                </div>
            </form>
        </div>
    )
}