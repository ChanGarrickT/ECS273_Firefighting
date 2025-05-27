import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const monthConversion = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
}

export default function IncidentLabel(props){
    return (
        <div className="flex flex-row incident-list text-xs h-full">
            {props.selectedIncidents.map((incident, idx) => {
                return <div className="mx-2 my-auto px-3 py-1" key={'name'+idx}>{incident.county} {monthConversion[incident.month]} {incident.year}<span className="ml-3 mr-0" onClick={() => props.removeIncident(idx)}>×</span></div>
            })}
        </div>
    )
}