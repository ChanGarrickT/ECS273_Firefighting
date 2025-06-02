import * as d3 from "d3";
import { useEffect } from "react";
import { countyNameList } from "../utilities";
import { monthList } from "../utilities";

const minYr = 2013;
const maxYr = 2019;

const yearsList = [];
for (let y = minYr; y <= maxYr; y++){
    yearsList.push(y.toString());
}

// Root component for menus
export function HistoryMenus(props){
    return (
        <div className="h-[2rem] flex flex-row align-center">
            <FilterSelector {...props}/>
            {props.filter === "YrMo" ? <TimeSelector {...props}/> : null}
            {props.filter === "County" ? <CountySelector {...props}/> : null}
        </div>
    )
}

// Dropdown for selecting filter
export function FilterSelector(props){
    function notifyChange(e){
        props.setFilter(e.target.value);
    }

    return (
        <div className="h-[2rem] flex flex-row align-center">
            <label htmlFor="filter-select" className="text-l mx-2">Filter by:</label>
            <select id="filter-select" className="flex bg-gray-100 text-black text-l p-1 rounded ml-2" onChange={notifyChange}>
                <option value="YrMo">Year & Month</option>
                <option value="County">County</option>
            </select>
        </div>
    )
}

// Dropdown for selecting year and month
export function TimeSelector(props){
    // Immediately save changes user makes
    function notifyChange(){
        const yr = d3.select("#year-selector").property("value");
        const mo = d3.select("#month-selector").property("value");
        props.setYearMonth({year: yr, month: mo});
    }
  
    useEffect(() => {
        d3.select("#year-selector").property("value", props.selectedYearMonth.year);
        d3.select("#month-selector").property("value", props.selectedYearMonth.month);
    }, [props.selectedYearMonth])

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

// Dropdown for county selection
export function CountySelector(props){
    // Immediately save changes user makes
    function notifyChange(e){
        if(props.modeRef.current === "History"){
            props.setSelectedCounty(e.target.value);
        }
    }

    // Change the dropdown value if county selection is changed elsewhere (e.g. clicking the map)
    useEffect(() => {
        d3.select("#county-selector").property("value", props.selectedCounty)
    }, [props.selectedCounty])

    return (
        <select id="county-selector" className="flex bg-gray-100 text-black text-l p-1 rounded ml-8" onChange={notifyChange}>
            <option key="0" value="None">Select County</option>
            {countyNameList.map((c) => <option key={c.formatted} value={c.formatted}>{c.clean}</option>)}
        </select>
    )
}

export default {HistoryMenus, FilterSelector, TimeSelector, CountySelector};