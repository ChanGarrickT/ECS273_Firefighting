import * as d3 from "d3";

export const countyNameList = [
        {clean: "Alameda", formatted: "Alameda"},
        {clean: "Alpine", formatted: "Alpine"},
        {clean: "Amador", formatted: "Amador"},
        {clean: "Butte", formatted: "Butte"},
        {clean: "Calaveras", formatted: "Calaveras"},
        {clean: "Colusa", formatted: "Colusa"},
        {clean: "Contra Costa", formatted: "Contracosta"},
        {clean: "Del Norte", formatted: "Delnorte"},
        {clean: "El Dorado", formatted: "Eldorado"},
        {clean: "Fresno", formatted: "Fresno"},
        {clean: "Glenn", formatted: "Glenn"},
        {clean: "Humboldt", formatted: "Humboldt"},
        {clean: "Imperial", formatted: "Imperial"},
        {clean: "Inyo", formatted: "Inyo"},
        {clean: "Kern", formatted: "Kern"},
        {clean: "Kings", formatted: "Kings"},
        {clean: "Lake", formatted: "Lake"},
        {clean: "Lassen", formatted: "Lassen"},
        {clean: "Los Angeles", formatted: "Losangeles"},
        {clean: "Madera", formatted: "Madera"},
        {clean: "Marin", formatted: "Marin"},
        {clean: "Mariposa", formatted: "Mariposa"},
        {clean: "Mendocino", formatted: "Mendocino"},
        {clean: "Merced", formatted: "Merced"},
        {clean: "Modoc", formatted: "Modoc"},
        {clean: "Mono", formatted: "Mono"},
        {clean: "Monterey", formatted: "Monterey"},
        {clean: "Napa", formatted: "Napa"},
        {clean: "Nevada", formatted: "Nevada"},
        {clean: "Orange", formatted: "Orange"},
        {clean: "Placer", formatted: "Placer"},
        {clean: "Plumas", formatted: "Plumas"},
        {clean: "Riverside", formatted: "Riverside"},
        {clean: "Sacramento", formatted: "Sacramento"},
        {clean: "San Benito", formatted: "Sanbenito"},
        {clean: "San Bernardino", formatted: "Sanbernardino"},
        {clean: "San Diego", formatted: "Sandiego"},
        {clean: "San Francisco", formatted: "Sanfrancisco"},
        {clean: "San Joaquin", formatted: "Sanjoaquin"},
        {clean: "San Luis Obispo", formatted: "Sanluisobispo"},
        {clean: "San Mateo", formatted: "Sanmateo"},
        {clean: "Santa Barbara", formatted: "Santabarbara"},
        {clean: "Santa Clara", formatted: "Santaclara"},
        {clean: "Santa Cruz", formatted: "Santacruz"},
        {clean: "Shasta", formatted: "Shasta"},
        {clean: "Sierra", formatted: "Sierra"},
        {clean: "Siskiyou", formatted: "Siskiyou"},
        {clean: "Solano", formatted: "Solano"},
        {clean: "Sonoma", formatted: "Sonoma"},
        {clean: "Stanislaus", formatted: "Stanislaus"},
        {clean: "Sutter", formatted: "Sutter"},
        {clean: "Tehama", formatted: "Tehama"},
        {clean: "Trinity", formatted: "Trinity"},
        {clean: "Tulare", formatted: "Tulare"},
        {clean: "Tuolumne", formatted: "Tuolumne"},
        {clean: "Ventura", formatted: "Ventura"},
        {clean: "Yolo", formatted: "Yolo"},
        {clean: "Yuba", formatted: "Yuba"}
]

export const monthList = [
    {name: 'January', code: '01'},
    {name: 'February', code: '02'},
    {name: 'March', code: '03'},
    {name: 'April', code: '04'},
    {name: 'May', code: '05'},
    {name: 'June', code: '06'},
    {name: 'July', code: '07'},
    {name: 'August', code: '08'},
    {name: 'September', code: '09'},
    {name: 'October', code: '10'},
    {name: 'November', code: '11'},
    {name: 'December', code: '12'},
];

export const monthConversion = {
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

export const monthConversionAbr = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'Aug',
    '09': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

export function highlight(county, mode){
    if(mode === "History"){
        d3.select(`#county-geo-${county}`).classed('county-incident-hover', true);
        d3.select(`#county-choice-${county}`).classed('county-incident-hover', true);
    } else {
        d3.select(`#county-geo-${county}`).classed('county-predict-hover', true);
        d3.select(`#county-choice-${county}`).classed('county-predict-hover', true);
    }
}

export function unhighlight(county){
    d3.select(`#county-geo-${county}`).classed('county-incident-hover county-predict-hover', false);
    d3.select(`#county-choice-${county}`).classed('county-incident-hover county-predict-hover', false);
}
