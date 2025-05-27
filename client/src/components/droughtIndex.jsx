import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { isEmpty, debounce } from 'lodash';

const margin = {top: 5, bottom: 20, left: 20, right: 5};

export default function DroughtGraph(props){
    const containerRef = useRef(null);
    const svgRef = useRef(null);

    // const [weatherData, setWeather] = useState([]);
    const weatherData = [
        {county: 'A', droughtIndex: 69},
        {county: 'B', droughtIndex: 37},
        {county: 'C', droughtIndex: 42},
    ];
    
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
            const { width, height } = containerRef.current.getBoundingClientRect();
            if (width && height) {
                drawGraph(svgRef.current, weatherData, width, height);
            }
    
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

    const yExtents = d3.extent(data.map((d) => d.droughtIndex));
    const xCategories = [...new Set(data.map((d) => d.county))];

    const xScale = d3.scaleBand()
        .rangeRound([margin.left, width - margin.right])
        .domain(xCategories);
       
    const yScale = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, yExtents[1]]);

    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(0));
    
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(5));

    const bars = svg.append('g').attr('class', 'bars');

    bars.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d) => xScale(d.county) + xScale.bandwidth()/4)
        .attr('y', (d) => yScale(d.droughtIndex))
        .attr('width', xScale.bandwidth()/2)
        .attr('height', (d) => Math.abs(yScale(0) - yScale(d.droughtIndex)))
        .attr('class', 'bar')
        .attr('id', (d) => `bar-${d.county}`);
}