import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { isEmpty, debounce } from 'lodash';

const margin = {top: 5, bottom: 8, left: 30, right: 5};

export default function DroughtGraph(props){
    const containerRef = useRef(null);
    const svgRef = useRef(null);

    // const [weatherData, setWeather] = useState([]);
    console.log(props);
    
    const weatherData = props.data;
    
    useEffect(() => {
            if (!containerRef.current || !svgRef.current) return;
    
            // Resize when container changes sizes
            const resizeObserver = new ResizeObserver(
            debounce((entries) => {
                for (const entry of entries) {
                    if (entry.target !== containerRef.current) continue;
                    const { width, height } = entry.contentRect;
                    if (width && height && !isEmpty(weatherData)) {
                        drawGraph(svgRef.current, weatherData, width, height);
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
    }, [weatherData]);

    return (
        <div className="w-full h-[calc(100%_-_1rem)] p-1" ref={containerRef}>
            <svg width="100%" height="100%" ref={svgRef}></svg>
        </div>
    )

}

function drawGraph(svgElement, data, width, height){
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const yExtents = d3.extent(data.map((d) => d.Drought_Index));
    const xCategories = [...new Set(data.map((d) => d.countyFull))];

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
        .attr('y1', yScale(0)+1)
        .attr('x2', width - margin.right)
        .attr('y2', yScale(0)+1)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(5));

    const bars = svg.append('g').attr('class', 'bars');

    bars.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d) => xScale(d.countyFull) + xScale.bandwidth()/4)
        .attr('y', (d) => yScale(Math.max(0, d.Drought_Index)))
        .attr('width', xScale.bandwidth()/2)
        .attr('height', (d) => Math.abs(yScale(0) - yScale(d.Drought_Index)))
        .attr('class', 'bar')
        .attr('id', (d) => `bar-${d.county}`);
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