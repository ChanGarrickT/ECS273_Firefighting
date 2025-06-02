import * as d3 from "d3";
import { feature, mesh } from "topojson-client";
import { useEffect, useRef } from "react";
import { isEmpty, debounce } from "lodash";
import { highlight, unhighlight } from "../utilities";
import Cali from "./caCountiesTopoSimple.json"

const MAX_ZOOM = 8;

export default function CaliMap(props){
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const counties = Cali.objects.subunits;

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        // Resize when container changes sizes
        const resizeObserver = new ResizeObserver(
        debounce((entries) => {
            for (const entry of entries) {
                if (entry.target !== containerRef.current) continue;
                const { width, height } = entry.contentRect;
                if (width && height && !isEmpty(counties)) {
                    drawMap(svgRef.current, width, height, props);                
                    highlightIncidents(props);
                }
            }
        }, 100) // wait at least 100 ms
        );

        resizeObserver.observe(containerRef.current);

        // Draw initially based on starting size
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width && height) {
            drawMap(svgRef.current, width, height, props);
            highlightIncidents(props);
        }

        return () => resizeObserver.disconnect();
    }, [props.selectedYearMonth, props.mode, props.filter, props.selectedCounty]);

    return(
        <div className="map-container flex flex-row" ref={containerRef} style={{ width: "100%", height: "100%" }}>
            <svg id="map-svg" className="w-full" ref={svgRef} width="100%" height="100%"></svg>
        </div>
    )
}

function drawMap(svgElement, width, height, props){
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();    // clear previous render
    const centerX = width / 2;
    const centerY = height / 2; 

    const projection = d3.geoMercator()
        .scale(4.5 * Math.min(width, height))
        .center([-119.3, 37.3])         // Coords for center of Cali
        .translate([centerX, centerY]);

    const mapPath = d3.geoPath().projection(projection);
    
    const g = svg.append("g");
    
    // County features
    const counties = g.append("g")
        .selectAll("path")
        .data(feature(Cali, Cali.objects.subunits).features)
        .join("path")
        .attr("id", (d) => `county-geo-${d.properties.name}`)
        .attr("class", "county-geo")
        .attr("fill", "gray")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("d", mapPath)
        .on("click", function(event, d){handleClick(this, d.properties.name)})
        .on("mouseover", function(event, d) {highlight(d.properties.name, props.mode)})
        .on("mouseout", function(event, d) {unhighlight(d.properties.name)});

    // Draw outer outline (a === b means draw only unshared borders)
    const outerEdge = g.append("path")
        .datum(mesh(Cali, Cali.objects.subunits, (a,b) => a === b))
        .attr("class", "outerEdge")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", mapPath);
    
    // Zoom logic
    const zoom = d3.zoom()
        .scaleExtent([1, MAX_ZOOM])
        .on("zoom", zoomManual);

    // Reset when clicking not on a county
    svg.on("click", () => {
        svg.transition(d3.easeQuadInOut)
            .duration(500)
            .call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([centerX, centerY])
            );
    });

    svg.call(zoom);
        
    function zoomManual(e){
        g.attr("transform", e.transform);
        counties.attr("stroke-width", 0.5 / e.transform.k);
        outerEdge.attr("stroke-width", 1 / e.transform.k); 
    }

    // Scrapped feature
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

    function handleClick(element, name){
        if(props.mode === "History"){
            // If filtering by time, only highlighted counties should respond to clicks
            if(d3.select(element).classed("county-geo-incident")){
                const selectedYear = props.selectedYearMonth.year;
                const selectedMonth =  props.selectedYearMonth.month; 
                props.addIncident({
                    year: selectedYear,
                    month: selectedMonth,
                    County: name
                });
            // If filtering by county, all counties are clickable
            } else if(d3.select(element).classed("county-geo-selectable")){
                props.setSelectedCounty(name);
            }
        } else {
            props.addPrediction(name);
        }
    }
}

async function highlightIncidents(props){
    d3.selectAll(".county-geo").classed("county-geo-incident county-geo-selected county-geo-predict", false);                   

    if(props.mode === "History"){
        // If filtering by time, highlight only counties with incidents in the selected time
        if(props.filter === "YrMo"){
            const selectedYear = props.selectedYearMonth.year;
            const selectedMonth =  props.selectedYearMonth.month; 
            try{
                await fetch(`http://localhost:8000/history?year=${selectedYear}&month=${selectedMonth}`)
                    .then((res) => res.json())
                    .then((data) => {
                        data.forEach((d) => {
                            d3.select(`#county-geo-${d.County}`).classed("county-geo-incident", true);
                        })
                    })
            } catch(error){
                console.error("Error fetching: ", error);
            }
        // If filtering by county, all counties should be highlighted; keep selected county super highlighted
        } else if(props.filter === "County"){
            d3.selectAll(".county-geo").classed("county-geo-selectable", true);
            d3.select(`#county-geo-${props.selectedCounty}`).classed("county-geo-selected", true);
        }
    } else {
        d3.selectAll(".county-geo").classed("county-predict", true);
        d3.select(`#county-geo-${props.selectedCounty}`).classed("county-predict", true);
    }
}
