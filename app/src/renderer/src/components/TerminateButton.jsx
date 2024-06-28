import { useRef } from 'react'
import Dialog from './Dialog'
import toast from 'react-hot-toast'

function TerminateButton({ terminate, setTerminate, init, setMode}) {
  // Reference to open and show the dialog
  const ref = useRef(null)

  return (
    <>
    <button
      className="my-2 mr-4 p-2
                bg-[#ea3344]
                rounded
                text-[#dee4ea]
                hover:bg-[#f63e50]
                disabled:opacity-50"
      onClick={() => {
        // Show the dialog
        ref.current.showModal()
      }}
      disabled={terminate}
    >
      Terminar
    </button>

    <Dialog someRef={ref} isOpen={false} notX={true}>
      <h3 className='text-slate-50
                      text-center
                      font-bold'
      > 
      ¿Deseas terminar la sesión?
      </h3>

      <p className='text-[#596773]
                    text-center
                    p-4
                    m-auto
                    w-64'
      >
      Hacerlo no permitirá loguear nuevos datos hasta que se cree una nueva sesión. 
      </p>

      <div className="flex justify-center">
        <button
          className="m-2 p-2
                    bg-[#454f59]
                    rounded
                    text-[#dee4ea]
                    hover:bg-[#8c9bab]"
          onClick={() => {
            // Show the dialog
            ref.current.close()
          }}
        >
          Cancelar
        </button>
        <button
          className="m-2 p-2
                    bg-[#ea3344]
                    rounded
                    text-[#dee4ea]
                    hover:bg-[#f63e50]"
          onClick={() => {
            setTerminate(true)
            setMode('read')
            toast.success("Se ha terminado la sesión")
            ref.current.close()
          }}
        >
          Terminar
        </button>
      </div>
    </Dialog>
    </>
  )
}

export default TerminateButton
