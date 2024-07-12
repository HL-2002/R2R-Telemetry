/* eslint-disable no-undef */
import { useRef, useState } from 'react'
import Dialog from './Dialog'
import Button from './Button'
import { useSessionStore } from '../context/SessionContext'
import toast from 'react-hot-toast'

export default function ExportButton() {
  // Reference to open and show the dialog
  const ref = useRef(null)
  // State to control the data to export (selected, or all data)
  const [selection, setSelection] = useState('')
  // State to set the path of the file to export
  const [path, setPath] = useState('')

  // Access to the global states
  const entries = useSessionStore((state) => state.Entry)
  const session = useSessionStore((state) => state.session)
  const runs = useSessionStore((state) => state.Runs)

  // Method to get the file path
  const selectPath = async () => {
    let pathObject = await readAPI.selectPath()
    setPath(pathObject.filePaths[0])
  }

  // Method to handle form submission
  const handleSelect = async () => {
    // Validate if there is no selection
    if (selection == '') {
      return toast.error('Debes seleccionar los intentos a exportar')
    }
    // Validate if there's no path
    if (path == '') {
      return toast.error('Debes seleccionar la ruta de exportación')
    }
    // Export the data
    if (selection == 'selected') {
        // Validate selection of runs
        if (entries.length === 0 ) return toast.error("No hay intentos seleccionados")

        const result = await readApi.exportCSV(entries, path, session?.description)
        if (result.success) {
            return toast.success('Datos exportados correctamente')
        }
        return toast.error('Error al exportar los datos')
    }
    // Export all data
    else if (selection == 'all') {
      let entriesDup = []
      for (let i = 0; i < runs.length; i++) {
        let entriesDB = await api.getEntryByRun(runs[i].id)
        entriesDup.push({ entries: entriesDB })
      }

      // Validate the session has entries
      if (entriesDup.length === 0) return toast.error("No hay datos que exportar")

      const result = await readAPI.exportCSV({
        entries: entriesDup,
        path,
        name: session?.description
      })

      if (result.success) {
        return toast.success('Datos exportados correctamente')
      }
      return toast.error('Error al exportar los datos')
    }
  }

  return (
    <>
      <Button onClick={() => {
        ref.current.showModal()
        setPath('')}}>
            Exportar CSV
        </Button>
      <Dialog someRef={ref} isOpen={false}>
        <h3
          className="text-slate-50
                            text-xl
                            text-center
                            font-bold
                            p-2"
        >
          Intentos a exportar
        </h3>
        <div className="flex justify-center">
          <button
            onClick={() => setSelection('selected')}
            className={`p-2 hover:cursor-pointer text-center m-2 ${selection == 'selected' ? 'bg-[#e94926]' : 'bg-[#ea3344]'} rounded text-[#dee4ea] hover:bg-[#e94926]`}
          >
            Intentos seleccionados
          </button>
          <button
            onClick={() => setSelection('all')}
            className={`p-2 hover:cursor-pointer text-center m-2 ${selection == 'all' ? 'bg-[#e94926]' : 'bg-[#ea3344]'} rounded text-[#dee4ea] hover:bg-[#e94926]`}
          >
            Todos los intentos
          </button>
        </div>
        <h3
          className="text-slate-50
                            text-xl
                            text-center
                            font-bold
                            p-2
                            mt-2"
        >
          Ruta de exportación
        </h3>
        <div className="flex justify-center">
          <Button onClick={() => selectPath()}>Dirección</Button>
          <p
            className="text-slate-50
                    text-center
                    p-4
                    w-64"
          >
            {path}
          </p>
        </div>
        <div className="flex justify-end p-2">
          <Button onClick={() => handleSelect()}>Exportar</Button>
        </div>
      </Dialog>
    </>
  )
}
