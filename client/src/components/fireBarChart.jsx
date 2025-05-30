import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { isEmpty, debounce } from 'lodash';

const margin = {top: 5, bottom: 8, left: 35, right: 5};

export default function FireBarChart(props){
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    // useEffect(() => {
    //     const selectedYear = props.selectedYearMonth.year;
    //     const selectedMonth =  props.selectedYearMonth.month;
    //     if(selectedYear === 'None' || selectedMonth === 'None'){
    //         const element = d3.select(svgRef.current);
    //         element.selectAll('*').remove();
    //     }
    // }, [props.selectedYearMonth]);
    
    const fireStats = props.data;
    
    useEffect(() => {
            if (!containerRef.current || !svgRef.current) return;
    
            // Resize when container changes sizes
            const resizeObserver = new ResizeObserver(
            debounce((entries) => {
                for (const entry of entries) {
                    if (entry.target !== containerRef.current) continue;
                    const { width, height } = entry.contentRect;
                    if (width && height) {
                        drawGraph(svgRef.current, fireStats, width, height, props.feature);
                    }
                }
            }, 100) // wait at least 100 ms
            );
    
            resizeObserver.observe(containerRef.current);
    
            // Draw initially based on starting size
            // const { width, height } = containerRef.current.getBoundingClientRect();
            // if (width && height) {
            //     drawGraph(svgRef.current, weatherData, width, height);
            // }
    
            return () => resizeObserver.disconnect();
    }, [fireStats]);

    return (
        <div className="w-full h-[calc(100%_-_1rem)] p-1" ref={containerRef}>
            <svg width="100%" height="100%" ref={svgRef}></svg>
        </div>
    )

}

function drawGraph(svgElement, data, width, height, feature){
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    if(isEmpty(data)){
        return;
    }

    const yExtents = d3.extent(data.map((d) => getFeature(d, feature)));
    const xCategories = [...new Set(data.map((d) => `${d.countyName} ${d.year}${d.month}`))];

    const xScale = d3.scaleBand()
        .rangeRound([margin.left, width - margin.right])
        .domain(xCategories);
       
    const yScale = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain(calcYAxis(yExtents))
        .nice();

    // svg.append('g')
    //     .attr('transform', `translate(0, ${yScale(0)})`)
    //     .call(d3.axisBottom(xScale).ticks(0));
    svg.append('line')
        .attr('x1', margin.left)
        .attr('y1', yScale(0)+0.5)
        .attr('x2', width - margin.right)
        .attr('y2', yScale(0)+0.5)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    
    // Draw Y Axis
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(5, getTickFormatByFeature(feature)));

    const bars = svg.append('g').attr('class', 'bars');

    bars.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d) => xScale(`${d.countyName} ${d.year}${d.month}`) + xScale.bandwidth()/10)
        .attr('y', yScale(0))
        .attr('width', xScale.bandwidth()/1.25)
        .attr('height', 0)
        .attr('class', 'bar')
        .attr('id', (d) => `bar-${d.county}`)
        .transition()
        .duration(250)
        .ease(d3.easePolyInOut)
        .attr('y', (d) => yScale(Math.max(0, getFeature(d, feature))))
        .attr('height', (d) => Math.abs(yScale(0) - yScale(getFeature(d, feature))))
}

function calcYAxis(extent){
    if(extent[0] >= 0){
        return [0, extent[1]]
    } else if(extent[1] < 0){
        return [extent[0], 0]
    } else {
        return extent
    }
}

function getFeature(datum, feature){
    switch (feature){
        case 'AcresBurned':
            return datum.AcresBurned;
        case 'Injuries':
            return datum.Injuries;
        case 'Fatalities':
            return datum.Fatalities;
        case 'StructuresDestroyed':
            return datum.StructuresDestroyed;
        case 'StructuresDamaged':
            return datum.StructuresDamaged;
        case 'PropetyValue_Damage':
            return datum.PropetyValue_Damage;
        case 'Drought_Index':
            return datum.Drought_Index;
        case 'Precipitation':
            return datum.Precipitation;
        case 'Temperature':
            return datum.Temperature;
        case 'Heating_Degree_Days':
            return datum.Heating_Degree_Days;
        case 'Cooling_Degree_Days':
            return datum.Cooling_Degree_Days;
        default:
            return null;
    }
}

function getTickFormatByFeature(feature){
    switch (feature){
        case 'AcresBurned':
            return '~s'
        case 'Injuries':
            return '';
        case 'Fatalities':
            return '';
        case 'StructuresDestroyed':
            return 'r';
        case 'StructuresDamaged':
            return 'r';
        case 'PropetyValue_Damage':
            return '~s';
        case 'Drought_Index':
            return '';
        case 'Precipitation':
            return '';
        case 'Temperature':
            return 'r';
        case 'Heating_Degree_Days':
            return 'r';
        case 'Cooling_Degree_Days':
            return 'r';
        default:
            return null;
    }
}