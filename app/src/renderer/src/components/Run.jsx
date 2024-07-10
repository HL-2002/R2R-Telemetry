import { useSessionStore } from '../context/SessionContext'
import toast from 'react-hot-toast'

// index is the index of the run in the list of runs
// run is the run object that contains the data of the run
export default function Run({ mode, index, run }) {
  // entries of the run
  const entries = useSessionStore((state) => state.Entry)

  // functions to set the entries in the global state
  const setEntry = useSessionStore((state) => state.setEntry)
  const addEntry = useSessionStore((state) => state.addEntry)

  // get the minutes, seconds and milliseconds of the run
  const min = Math.floor(run?.duration / 60000)
  const sec = Math.floor((run?.duration % 60000) / 1000)
  const ms = Math.floor(run?.duration % 1000)

  // this function gets the entries for the run
  const handleClick = async () => {
    // if the entries are already loaded, don't load them again,remove by id
    if (entries.some((entry) => entry.run_id === run.id)) {
      setEntry(entries.filter((entry) => entry.run_id !== run.id))
      return
    }

    // Add 4 entries at most
    if (entries.length < 4) {
      // get the entries from the api
      const entriesDB = await api.getEntryByRun(run.id)
      // set the entries in the global state to show them in the UI
      addEntry({ entries: entriesDB, run_id: run.id })
    }
    else {
      toast.error('No se pueden cargar más de 4 intentos')
    }
    
  }
  //  check if the run is selected to change the color of the button
  const isSelected = entries.some((entry) => entry.run_id === run.id)
  return (
    <button
      className={`m-1 p-2
                        bg-[#e94926]
                        rounded-md
                        ${isSelected ? 'text-black': 'text-[#dee4ea]'}
                        font-bold
                        text-[#dee4ea]
                        shadow-2xl
                        shadow-slate-900
                        hover:bg-[#ec6d2d]
                        disabled:opacity-50

                        ${isSelected ? 'bg-[#ec6d2d]' : 'bg-[#e94926]'}
                        `}
      style={{ width: 95 + '%' }}
      onClick={handleClick}
      disabled={mode === 'log'}
    >
      <h1 className="text-left">Intento {index + 1}</h1>
      <div className="flex justify-between">
        <p className="text-sm">{run?.hour}</p>
        <p className="text-sm">
          {`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`}
        </p>
      </div>
    </button>
  )
}
