import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { countyNameList, monthConversion, highlight, unhighlight} from "../utilities";

// The component allowing selections to be made by clicking text instead of the map
export default function ChoicesList(props){
    const containerRef = useRef(null);

    // Respond to changes in filters and filter mode
    useEffect(() => {
        if(props.filter === 'YrMo'){
            addNames(containerRef.current, props)
        } else if(props.filter === 'County'){
            addTimes(containerRef.current, props)
        }
    }, [props.selectedYearMonth, props.selectedCounty, props.filter])

    return (
        <div className="h-full" ref={containerRef} style={{overflowY: "scroll"}}></div>
    )
}

// Populate the list with county names
function addNames(divElement, props){
    // Clear the list first
    const container = d3.select(divElement);
    container.selectAll('*').remove();

    try{
        fetch(`http://localhost:8000/history?year=${props.selectedYearMonth.year}&month=${props.selectedYearMonth.month}`)
            .then((res) => res.json())
            .then((data) => {
                for(let c = 0; c < countyNameList.length; c++){
                    for(let i = 0; i < data.length; i++){
                        if(countyNameList[c].formatted === data[i].County){
                            let payload = {...props};
                            payload.selectedCounty = data[i].County;     
                            container.append('p')
                                .attr('id', `county-choice-${data[i].County}`)
                                .attr('class', 'county-choice')
                                .text(countyNameList[c].clean)
                                .on('click', function(event) {handleClick(payload)})
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

// Populate the list with months
function addTimes(divElement, props){
    // Clear the list first
    const container = d3.select(divElement);
    container.selectAll('*').remove();

    try{
        fetch(`http://localhost:8000/history?county=${props.selectedCounty}`)
            .then((res) => res.json())
            .then((data) => {
                for(let i = 0; i < data.length; i++){
                    const year = data[i].Started.substring(0,4);
                    const month = data[i].Started.substring(4,6);
                    let payload = {...props};
                    payload.selectedYearMonth = {year: year, month: month};
                    container.append('p')
                        .attr('id', `time-choice-${month}-${year}`)
                        .attr('class', 'time-choice')
                        .text(`${monthConversion[month]} ${year}`)
                        .on('click', function(event) {handleClick(payload)});                    
                }               
            })
    } catch(error){
        console.error('Error fetching: ', error);
        
    }
}

function handleClick(props){    
    props.addIncident({
        year: props.selectedYearMonth.year,
        month: props.selectedYearMonth.month,
        countyName: props.selectedCounty
    });
}
