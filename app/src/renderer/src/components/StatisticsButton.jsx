import { useRef, useState, useEffect } from 'react'
import Dialog from './Dialog'
import Button from './Button'
import { useSessionStore } from '../context/SessionContext'
import Constants from '../constants.js'
const { Stats, Capacity, BorderColors } = Constants

export default function StatisticsButton({ minRunId }) {
    // State to display the statistics or their selection
    const [page, setPage] = useState(0)
    const [selection, setSelection] = useState([])
    const [current, setCurrent] = useState([])
    const [Available, setAvailable] = useState(Stats)
    /* 
        The statistics object follows the interface:
        {
            '0-100' : {run_id: value, run_id: value, ...},
            '0-200' : {run_id: value, run_id: value, ...},
            ..
    }
    */
    const [statistics, setStatistics] = useState({})

    // Reference to open and show the dialog
    const ref = useRef(null)

    // Access to the global states
    const entries = useSessionStore((state) => state.Entry)
    const session = useSessionStore((state) => state.session)

    // Functions
    const handleSelect = (item) => {
        if (current.includes(item)) {
            setCurrent(current.filter((i) => i !== item))
        } else {
            setCurrent([...current, item])
        }
    }

    function getStatValue(entries, stat) {
        let value = 'NaN'
        switch (stat) {
            case '0-100':
                for (let i = 0; i < entries.length; i++) {
                    if (entries[i].velocity >= 100) {
                        value = String(Math.round(entries[i].time * 100) / 100) + ' s'
                        break
                    }
                }
                break
            case '0-200':
                for (let i = 0; i < entries.length; i++) {
                    if (entries[i].velocity >= 200) {
                        value = String(Math.round(entries[i].time * 100) / 100) + ' s'
                        break
                    }
                }
                break
            case '75m':
                for (let i = 0; i < entries.length; i++) {
                    if (entries[i].distance >= 75) {
                        value = String(Math.round(entries[i].time * 100) / 100) + ' s'
                        break
                    }
                }
                break
            case 'Max Gs':
                value = 0
                entries.forEach((entry) => {
                    if (entry.lateral_g > value) {
                        value = String(Math.round(entry.lateral_g * 100) / 100) + ' g'
                    }
                })
                break
            case 'KM/L':
                value = entries[entries.length-1].distance / (Capacity - (entries[entries.length-1].fuel * Capacity / 100))
                value = String(Math.round(value * 100) / 100) + ' km/l'
                break
        }

        return value
    }

    function filterStats (stats, selection) {
        // Delete stats not in selection
        for (let stat in stats) {
            if (!selection.includes(stat)) {
                delete stats[stat]
            }
        }
    }

    function filterEntries (stats, entries) {
        let ids = entries.map((entry) => entry.run_id)

        // Delete values from ent
        for (let stat in stats) {
            for (let id in stats[stat]) {
                if (!ids.includes(parseInt(id))) {
                    delete stats[stat][id]
                }
            }
        }
    }

    // Hooks 
    // Set the initial selection based on session type
    useEffect(() => {
        switch (session.type) {
            case 'Acceleration':
                setCurrent(['0-100', '0-200', '75m'])
                break
            case 'Skidpad':
                setCurrent(['Max Gs'])
                break
            case 'Endurance':
                setCurrent(['KM/L'])
                break
            case 'Autocross':
            case 'Personalizado':
                setCurrent([])
                break
        }
    }, [session])

    // Recalculate the stats based on the entries available
    useEffect(() => {
        // Reset stats if no entries or no selection
        if (entries.length === 0 || current.length === 0) {
            setStatistics({})
            return
        }

        // Calculate stats if necessary
        current.forEach((stat) => {
            // If the stat hasn't been calculated, calculate it fully
            if (!(stat in statistics)) {
                statistics[stat] = {}
                // Calculate stats per entry
                entries.forEach((entrySet) => {
                    statistics[stat][entrySet.run_id] = getStatValue(entrySet.entries, stat)
                })
            }
            // If the stat has been calculated, add entries left
            else {
                entries.forEach((entrySet) => {
                    if (!(entrySet.run_id in statistics[stat])) {
                        statistics[stat][entrySet.run_id] = getStatValue(entrySet.entries, stat)
                    }
                })
            }
        })

        // Filter stats based on selection
        filterStats(statistics, current)

        // Filter stats based on entries
        filterEntries(statistics, entries)

    }, [entries, current])
    
    // Update selection 
    useEffect(()=>{
        setAvailable(Stats.filter((item) => !current.includes(item)))
        setSelection(current)
    }, [current])


    return (
        <> 
            <Button onClick={() => {
                ref.current.showModal()
                setPage(0)
                }}>
                Estadísticas
            </Button>
            <Dialog someRef={ref} isOpen={false} notX={page !== 0} > 
                {page === 0 ? 
                <StatisticsDisplay setPage={setPage}
                    selection={selection}
                    entries={entries}
                    minRunId={minRunId}
                    statistics={statistics} /> 
                : 
                <StatisticsSelection setPage={setPage} 
                    current={current} 
                    Available={Available} 
                    handleSelect={handleSelect} />
                }
            </Dialog>
        </>
    )
}


// MENU COMPONENTS
function StatisticsSelection({ setPage, current, Available, handleSelect }) {
    return (
        <>  
        <div className="grid grid-cols-2 col-span-2">
            <div>
                <h2 className="text-xl  text-[#dee4ea] font-bold ">Estadísticas actuales</h2>

                <ul className="flex flex-col gap-1 min-h-60 max-h-60 overflow-y-scroll scroll-hidden">
                {current.map((item) => {
                    return (
                    <li
                        className="text-[#dee4ea]  text-lg hover:cursor-pointer hover:text-[#ea3344]"
                        key={item}
                        onClick={() => handleSelect(item)}
                    >
                        {item}
                    </li>
                    )
                })}
                </ul>
            </div>

            <div>
                <h2 className="text-xl    text-[#dee4ea] font-bold">Estadísticas disponibles</h2>
                <ul className="flex flex-col min-h-60 max-h-60  gap-1 overflow-y-scroll scroll-hidden">
                {Available.map((item) => {
                    return (
                    <li
                        className="text-[#ea3344]  text-lg hover:cursor-pointer hover:text-[#dee4ea] "
                        key={item}
                        onClick={() => handleSelect(item)}
                    >
                        {item}
                    </li>
                    )
                })}
                </ul>
            </div>
        </div>
        <div className='flex justify-end'>
            <Button onClick={() => setPage(0)}> Regresar </Button>
        </div>
            
        </>
    )
}

function StatisticsDisplay({ setPage, selection, entries, minRunId, statistics }) {
    // Flatten the statistics object to build table
    let flattened = []

    // Table headers
    let stats = Object.keys(statistics)
    stats.forEach((stat) => {
        flattened.push(
            <p key={stat} className='font-semibold text-slate-100'> 
            {stat} 
            </p>
        )
    })

    // Table rows
    entries.forEach((entrySet, i) => {
        // Run N
        flattened.push(
            <p key={entrySet.run_id} 
            style={{color : BorderColors[i]}}
            className='font-semibold'> 
            Intento {Number(entrySet.run_id) - minRunId + 1} 
            </p>
        )

        // Stats for given run
        stats.forEach((stat) => {
            flattened.push(
                <p key={`${entrySet.run_id}-${stat}`} 
                style={{color : BorderColors[i]}}> 
                {statistics[stat][entrySet.run_id]}
                </p>
            )
        })
    })

    return (
        <> 
            <h3 
            className="text-slate-50
                                text-xl
                                text-center
                                font-bold
                                p-2"
            >
            Estadísticas
            </h3>
            { entries.length === 0 ? 
            <p className='text-slate-100'> No hay intentos seleccionados </p> 
            :
            selection.length === 0 ?
            <p className='text-slate-100'> No hay estadísticas seleccionadas </p>
            :
            <div className={`grid p-4`}
                style={{gridTemplateColumns: `repeat(${stats.length + 1}, minmax(0, 5rem))`}}>
                <p> </p>
                {flattened.map((item) => {
                    return item
                })}
            </div>
            }
            
            <div className='flex justify-end'>
                <Button onClick={() => setPage(1)}> Seleccionar </Button>
            </div>
        </>
    )
}
