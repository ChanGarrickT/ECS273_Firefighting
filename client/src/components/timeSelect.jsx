import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const minYr = 2013;
const maxYr = 2019;

const yearsList = [];
for (let y = minYr; y <= maxYr; y++){
    yearsList.push(y.toString());
}

const monthList = [
    {name: 'January', code: '01'},
    {name: 'February', code: '02'},
    {name: 'March', code: '03'},
    {name: 'April', code: '04'},
    {name: 'May', code: '05'},
    {name: 'June', code: '06'},
    {name: 'July', code: '07'},
    {name: 'August', code: '08'},
    {name: 'September', code: '09'},
    {name: 'October', code: '10'},
    {name: 'November', code: '11'},
    {name: 'December', code: '12'},
];


export default function TimeSelector(props){
    function notifyChange(){
        const yr = d3.select('#year-selector').property('value');
        const mo = d3.select('#month-selector').property('value');
        props.setTime({year: yr, month: mo});
    }

    return (
        <div className="flex flex-row align-center w-1/4">
            <select id="year-selector" className="flex bg-gray-100 text-black text-l p-1 rounded ml-8" onChange={notifyChange}>
                <option key="0" value="None">Select Year</option>
                {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select id="month-selector" className="flex bg-gray-100 text-black text-l p-1 rounded mx-2" onChange={notifyChange}>
                <option key="00" value="None">Select Month</option>
                {monthList.map((m) => <option key={m.code} value={m.code}>{m.name}</option>)}
            </select>
        </div>
    )
}