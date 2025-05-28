import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { countyNameList, highlight, unhighlight} from "../utilities";

export default function CountyList(props){
    const containerRef = useRef(null);

    useEffect(() => {
        addNames(containerRef.current, props.selectedYearMonth, props.addIncident)
        
    }, [props.selectedYearMonth])

    return (
        <div className="h-full" ref={containerRef} style={{overflowY: "scroll"}}>
            
        </div>
    )
}

function addNames(divElement, selectedYearMonth, addIncident){
    const container = d3.select(divElement);
    container.selectAll('*').remove();
    try{
        fetch(`http://localhost:8000/history?year=${selectedYearMonth.year}&month=${selectedYearMonth.month}`)
            .then((res) => res.json())
            .then((data) => {
                for(let c = 0; c < countyNameList.length; c++){
                    for(let i = 0; i < data.length; i++){
                        if(countyNameList[c].formatted === data[i].County){     
                            const cleanName = countyNameList[c].clean + ' County';
                            const formattedName = countyNameList[c].formatted        
                            container.append('p')
                                .attr('id', `county-choice-${data[i].County}`)
                                .attr('class', 'county-choice')
                                .text(countyNameList[c].clean)
                                .on('click', function(event) {handleClick(this, cleanName, formattedName, addIncident)})
                                .on('mouseover', () => highlight(data[i].County))
                                .on('mouseout', () => unhighlight(data[i].County));
                        }
                    }
                }
            })
    } catch(error){
        console.error('Error fetching: ', error);
        
    }
}

function handleClick(element, fullName, name, addIncident){
    const currentYear = d3.select('#year-selector').property('value');
    const currentMonth =  d3.select('#month-selector').property('value');        
    addIncident({
        year: currentYear,
        month: currentMonth,
        countyFull: fullName,
        countyName: name
    });
}
