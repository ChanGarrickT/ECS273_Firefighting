import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { countyNameList, monthConversionAbr } from "../utilities";

export default function IncidentLabel(props){
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