import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { countyNameList, monthConversion } from "../utilities";

export default function IncidentLabel(props){
    return (
        <div className="flex flex-row incident-list text-s h-full">
            {props.selectedIncidents.map((incident, idx) => {
                let fullName = '';
                for(let i = 0; i < countyNameList.length; i++){
                    if(countyNameList[i].formatted === incident.countyName){
                        fullName = countyNameList[i].clean;
                    }
                }
                return <div className="mx-2 my-auto px-3 py-1" key={'name'+idx}>{fullName} – {monthConversion[incident.month]} {incident.year}<span className="ml-3 mr-0" onClick={() => props.removeIncident(idx)}>×</span></div>
            })}
        </div>
    )
}