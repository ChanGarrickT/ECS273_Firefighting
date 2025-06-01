import * as d3 from "d3";
import { useEffect } from "react";
import { countyNameList, monthConversionAbr } from "../utilities";

// The colored labels serving as a legend for the bar charts
export default function IncidentLabel(props){
    // If there are more than 3 selections, shrink text to fit more on screen
    useEffect(() => {
        if(props.selectedIncidents.length <= 3){
            d3.select('#incident-label-container').classed('text-xs', false).classed('text-s', true);
        } else {
            d3.select('#incident-label-container').classed('text-s', false).classed('text-xs', true);
        }
    }, [props.selectedIncidents]);

    return (
        <div id="incident-label-container" className="flex flex-row incident-list h-full">
            {props.selectedIncidents.map((incident, idx) => {
                let fullName = '';
                for(let i = 0; i < countyNameList.length; i++){
                    if(countyNameList[i].formatted === incident.countyName){
                        fullName = countyNameList[i].clean;
                    }
                }
                return <div className="mx-1 my-auto px-2 py-1" key={'name'+idx}>{fullName} - {monthConversionAbr[incident.month]} {incident.year}<span className="ml-3 mr-0" onClick={() => props.removeIncident(idx)}>×</span></div>
            })}
        </div>
    )
}