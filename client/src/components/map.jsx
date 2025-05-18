import * as d3 from "d3";
import { feature, mesh } from "topojson-client";
import { useEffect, useRef, useState } from "react";
import { isEmpty, debounce } from 'lodash';
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
                }
            }
        }, 100) // wait at least 100 ms
        );

        resizeObserver.observe(containerRef.current);

        // Draw initially based on starting size
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width && height) {
            drawMap(svgRef.current, width, height, props);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return(
        <div className="map-container d-flex" ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <svg id="map-svg" ref={svgRef} width="100%" height="100%"></svg>
        </div>
    )
}

function drawMap(svgElement, width, height, props){
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
        .attr('class', 'county')
        .attr('fill', 'gray')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .attr('d', mapPath)
        .on('click', (event, d) => {
            // Do something in parent component
            props.getCurrentCounty(d.properties.fullName);
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
                    d3.pointer(event, svg.node())
                );
        })
        .on('mouseover', function(event, d) {
            d3.select(this).attr('fill', '#ff0');
        })
        .on('mouseout', function(event, d){
            d3.select(this).attr('fill', 'gray')
        });

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
        .on('zoom', (e) => {
            g.attr('transform', e.transform);
            counties.attr('stroke-width', 0.5 / e.transform.k);
            outerEdge.attr('stroke-width', 1 / e.transform.k);       
    });

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
}
