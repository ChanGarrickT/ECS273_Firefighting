import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { isEmpty, debounce } from 'lodash';
import DroughtGraph from "./droughtIndex";

export default function WeatherData(props){

    return (
        <div className="flex flex-row h-full">
            <div className="flex flex-col w-1/5 h-full">
                <DroughtGraph {...props}/>
                <p className="text-xs text-center h-1rem p-1">Drought Index</p>
            </div>
            <div className="flex flex-col bg-blue-200 w-1/5 h-full">
                <div className="w-full h-[calc(100%_-_1rem)] p-1"></div>
                <p className="text-xs text-center p-1">Precipitation</p>
            </div>
            <div className="flex flex-col bg-blue-200 w-1/5 h-full">
                <div className="w-full h-[calc(100%_-_1rem)] p-1"></div>
                <p className="text-xs text-center p-1">Temperature</p>
            </div>
            <div className="flex flex-col bg-blue-200 w-1/5 h-full">
                <div className="w-full h-[calc(100%_-_1rem)] p-1"></div>
                <p className="text-xs text-center p-1">Heating Days</p>
            </div>
            <div className="flex flex-col bg-blue-200 w-1/5 h-full">
                <div className="w-full h-[calc(100%_-_1rem)] p-1"></div>
                <p className="text-xs text-center p-1">Cooling Days</p>
            </div>
        </div>
    )
}

function drawDrought(svgElement, data, width, height){
    console.log(width);
    console.log(height);
    
    
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const yExtents = d3.extent(data.map((d) => d.droughtIndex));
    const xCategories = [...new Set(data.map((d) => d.county))];

    const xScale = d3.scaleBand()
        .rangeRound([0, width])
        .domain(xCategories);
       
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, yExtents[1]]);

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('font-size', 3)
        .call(d3.axisBottom(xScale));
    
    svg.append('g')
        .call(d3.axisLeft(yScale));
}