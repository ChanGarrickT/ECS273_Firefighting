import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { monthConversion } from "../utilities";

export default function IncidentLabel(props){
    return (
        <div className="flex flex-row incident-list text-s h-full">
            {props.selectedIncidents.map((incident, idx) => {
                const index = incident.countyFull.indexOf(' County');
                return <div className="mx-2 my-auto px-3 py-1" key={'name'+idx}>{incident.countyFull.slice(0, index)} – {monthConversion[incident.month]} {incident.year}<span className="ml-3 mr-0" onClick={() => props.removeIncident(idx)}>×</span></div>
            })}
        </div>
    )
}