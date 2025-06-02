import FireBarChart from "./fireBarChart";

export default function WeatherData(props){

    return (
        <div className="border-2 border-gray-300 rounded-xl h-full">
            <div className="flex flex-row h-full">
                <div className="flex flex-col w-1/3 h-full">
                    <FireBarChart {...props} feature="Drought_Index"/>
                    <p className="text-xs text-center h-1rem p-1">Drought Index</p>
                </div>
                <div className="flex flex-col w-1/3 h-full">
                    <FireBarChart {...props} feature="Precipitation"/>
                    <p className="text-xs text-center p-1">Precipitation (in.)</p>
                </div>
                <div className="flex flex-col w-1/3 h-full">
                    <FireBarChart {...props} feature="Temperature"/>
                    <p className="text-xs text-center p-1">Temperature (ºF)</p>
                </div>
                {/* <div className="flex flex-col w-1/5 h-full">
                    <FireBarChart {...props} feature="Heating_Degree_Days"/>
                    <p className="text-xs text-center p-1">Heating Days</p>
                </div>
                <div className="flex flex-col w-1/5 h-full">
                    <FireBarChart {...props} feature="Cooling_Degree_Days"/>
                    <p className="text-xs text-center p-1">Cooling Days</p>
                </div> */}
            </div>
        </div>
    )
}
