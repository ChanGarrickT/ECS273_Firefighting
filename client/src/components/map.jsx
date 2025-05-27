import * as d3 from "d3";
import { feature, mesh } from "topojson-client";
import { useEffect, useRef, useState } from "react";
import { isEmpty, debounce } from 'lodash';
import Cali from "./caCountiesTopoSimple.json"

const MAX_ZOOM = 8;
const MARGIN = 20;

export default function CaliMap(props){
    const containerRef = useRef(null);
    const selectorRef = useRef(null);
    const svgRef = useRef(null);
    const counties = Cali.objects.subunits;

    useEffect(() => {
        if (!containerRef.current || !selectorRef.current || !svgRef.current) return;

        // Resize when container changes sizes
        const resizeObserver = new ResizeObserver(
        debounce((entries) => {
            for (const entry of entries) {
                if (entry.target !== containerRef.current) continue;
                const { width, height } = entry.contentRect;
                if (width && height && !isEmpty(counties)) {
                    drawMap(selectorRef.current, svgRef.current, width*3/4, height, props);
                    // highlightIncidents(props);
                }
            }
        }, 100) // wait at least 100 ms
        );

        resizeObserver.observe(containerRef.current);

        // Draw initially based on starting size
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width && height) {
            drawMap(selectorRef.current, svgRef.current, width*3/4, height, props);
            // highlightIncidents(props);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return(
        <div className="map-container flex flex-row" ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <svg id="map-svg" className="w-3/4" ref={svgRef} width="100%" height="100%"></svg>
            <div id="county-selector" className="w-1/4" ref={selectorRef}></div>
        </div>
    )
}

function drawMap(selectorElement, svgElement, width, height, props){
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();    // clear previous render
    const centerX = width / 2;
    const centerY = height / 2; 

    const projection = d3.geoMercator()
        .scale(4 * height)
        .center([-120, 37.3])         // Coords for center of Cali
        .translate([centerX, centerY]);

    const mapPath = d3.geoPath().projection(projection);
    
    const g = svg.append('g');

    // Draw base layer
    // g.append('path')
    //     .datum(feature(Cali, Cali.objects.subunits))
    //     .attr('d', mapPath);
    
    // County features
    const counties = g.append('g')
        .selectAll('path')
        .data(feature(Cali, Cali.objects.subunits).features)
        .join('path')
        .attr('id', (d) => `county-geo-${d.properties.name}`)
        .attr('class', 'county-geo')
        .attr('fill', 'gray')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .attr('d', mapPath)
        .on('click', function(event, d){handleClick(this, d.properties.fullName, d.properties.name, props.addIncident)})
        .on('mouseover', highlight)
        .on('mouseout', unhighlight);

    // Draw outer outline (a === b means draw only unshared borders)
    const outerEdge = g.append('path')
        .datum(mesh(Cali, Cali.objects.subunits, (a,b) => a === b))
        .attr('class', 'outerEdge')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('d', mapPath);
    
    // Zoom logic
    const zoom = d3.zoom()
        .scaleExtent([1, MAX_ZOOM])
        .on('zoom', zoomManual);

    // Reset when clicking not on a county
    svg.on('click', () => {
        svg.transition(d3.easeQuadInOut)
            .duration(500)
            .call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([centerX, centerY])
            );
    });

    svg.call(zoom);

    const selector = d3.select(selectorElement);
    
    selector.selectAll('*').remove();

    selector.selectAll('p')
        .data((feature(Cali, Cali.objects.subunits).features).slice().sort((a,b) => d3.ascending(a.properties.name, b.properties.name)))
        .join('p')
        .text((d) => d.properties.fullName)
        .attr('id', (d) => `county-choice-${d.properties.name}`)
        .attr('class', 'county-choice')
        .style('background-color', 'white')
        // .on('click', function(event, d){zoomToCounty(event, d)})
        .on('mouseover', highlight)
        .on('mouseout', unhighlight);

    function highlight(event, d){
        // d3.select(`#county-geo-${d.properties.name}`).attr('fill', '#ff0');
        d3.select(`#county-choice-${d.properties.name}`).style('background-color', '#ff0');
    }

    function unhighlight(event, d){
        // d3.select(`#county-geo-${d.properties.name}`).attr('fill', 'gray');
        d3.select(`#county-choice-${d.properties.name}`).style('background-color', 'white');
    }
        
    function zoomManual(e){
        g.attr('transform', e.transform);
        counties.attr('stroke-width', 0.5 / e.transform.k);
        outerEdge.attr('stroke-width', 1 / e.transform.k); 
    }

    function zoomToCounty(event, d){
        // Do something in parent component
        // props.getCurrentCounty(d.properties.fullName);
        const [[x1, y1], [x2, y2]] = mapPath.bounds(d);
        // Prevent reset when clicking a county
        event.stopPropagation();
        svg.transition(d3.easeQuadInOut)
            .duration(500)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(centerX, centerY)
                    .scale(Math.min(MAX_ZOOM, 0.8 / Math.max((x2-x1)/width, (y2-y1)/height)))
                    .translate((x1 + x2) / -2, (y1 + y2) / -2),
                // d3.pointer(event, g.node())
            );
    }

    function handleClick(element, fullName, name, addIncident){
        if(d3.select(element).classed('county-geo-incident')){
            const currentYear = d3.select('#year-selector').property('value');
            const currentMonth =  d3.select('#month-selector').property('value');        
            addIncident({
                year: currentYear,
                month: currentMonth,
                countyFull: fullName,
                countyName: name
            });
        }
    }
}

function highlightIncidents(props){
    const {selectedYear, selectedMonth} = props.selectedYearMonth.current;
    d3.selectAll('.county-geo').classed('county-geo-incident', false);                   
    if (selectedYear !== 'None' && selectedMonth !== 'None'){
        props.historyData.current.forEach((incident) => {
            if(incident.Started === selectedYear + selectedMonth){
                d3.select(`#county-geo-${incident.County}`).classed('county-geo-incident', true);            
            }
        })
    }
}
