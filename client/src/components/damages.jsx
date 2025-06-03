import FireBarChart from "./fireBarChart";

export default function DamageData(props){

    return (
        <div className="flex flex-row h-full">
            <div className="flex flex-col w-1/6 h-full">
                <FireBarChart {...props} feature="AcresBurned"/>
                <p className="text-xs text-center h-1rem p-1 unselectable">Acres Burned</p>
            </div>
            <div className="flex flex-col w-1/6 h-full">
                <FireBarChart {...props} feature="Injuries"/>
                <p className="text-xs text-center p-1 unselectable">Injuries</p>
            </div>
            <div className="flex flex-col w-1/6 h-full">
                <FireBarChart {...props} feature="Fatalities"/>
                <p className="text-xs text-center p-1 unselectable">Fatalities</p>
            </div>
            <div className="flex flex-col w-1/6 h-full">
                <FireBarChart {...props} feature="StructuresDestroyed"/>
                <p className="text-xs text-center p-1 unselectable">Structures Destroyed</p>
            </div>
            <div className="flex flex-col w-1/6 h-full">
                <FireBarChart {...props} feature="StructuresDamaged"/>
                <p className="text-xs text-center p-1 unselectable">Structures Damaged</p>
            </div>
            <div className="flex flex-col w-1/6 h-full">
                <FireBarChart {...props} feature="PropetyValue_Damage"/>
                <p className="text-xs text-center p-1 unselectable">Property Damage ($)</p>
            </div>
        </div>
    )
}
