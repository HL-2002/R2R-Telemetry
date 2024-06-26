import { useSessionStore } from '../context/SessionContext'
import toast from 'react-hot-toast'

const ErrorMessages = () => toast.error('No hay una sesión activa')

function InitButton({ init, setInit, setNow}) {
  const session = useSessionStore((state) => state.session)
  return (
    <button
      className="m-2 p-2
                bg-[#e94926]
                rounded
                text-[#dee4ea]
                hover:bg-[#ec6d2d]
                disabled:opacity-50"
      onClick={() => {
        if (session === null) {
          ErrorMessages()
          return
        }
        setInit(true)
        setNow(Date.now())
      }}
      disabled={(init||session === null)}
    >
      Iniciar
    </button>
  )
}

export default InitButton
