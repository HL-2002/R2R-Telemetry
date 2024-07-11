import { useRef, useState } from 'react'
import Dialog from './Dialog'
import Button from './Button'
import toast from 'react-hot-toast'

export default function ExportButton() {
    // Reference to open and show the dialog
    const ref = useRef(null)
    // State to control the data to export (selected, or all data)
    const [selection, setSelection] = useState('')
    // State to set the path of the file to export
    const [path, setPath] = useState('')

    // Access to the global states
    // Session state
    // Run state


    // Method to handle form submission
    const handleSelect = async (event) => {
        // Validate if there is no selection

        // Validate if there's no path

        // Export the data
    }

    return (
        <>
        <Button onClick={() => ref.current.showModal()}>
            Exportar CSV
        </Button>
        <Dialog someRef={ref} isOpen={false}>
            <h3 className='text-slate-50
                            text-xl
                            text-center
                            font-bold'> 
                Intentos a exportar
            </h3>
            <div className='flex justify-center'>
                <button onClick={() => setSelection('selected')}
                        className={`p-2 hover:cursor-pointer text-center m-2 ${selection == 'selected' ? 'bg-[#e94926]' : 'bg-[#ea3344]'} rounded text-[#dee4ea] hover:bg-[#e94926]`}> 
                    Intentos seleccionados
                </button>
                <button onClick={() => setSelection('all')}
                        className={`p-2 hover:cursor-pointer text-center m-2 ${selection == 'all' ? 'bg-[#e94926]' : 'bg-[#ea3344]'} rounded text-[#dee4ea] hover:bg-[#e94926]`}> 
                    Todos los intentos
                </button>
            </div>
            <h3 className='text-slate-50
                            text-xl
                            text-center
                            font-bold'> 
                Ruta de exportación
            </h3>
            <div className='flex justify-center'>
                <Button onClick={() => setPath(dialog.showOpenDialog({properties: ['openDirectory']}))}>
                    Dirección
                </Button>
                <p className='text-slate-50
                    text-center
                    p-4
                    w-64'>
                    {path}
                </p>
            </div>
            <div className='flex justify-end'>
                <Button onClick={() => toast.success('Exportando CSV...')}>
                    Exportar
                </Button>
            </div>
        </Dialog>
        </>
    )
}

function exportCSV(entries, path) {

}