import { useSessionStore } from '../context/SessionContext'

function InitButton({ init, setInit, setNow, selection }) {
  const session = useSessionStore((state) => state.session)
  return (
    <button
      className="my-2 mr-4 p-2
                bg-[#e94926]
                rounded
                text-[#dee4ea]
                hover:bg-[#ec6d2d]
                disabled:opacity-50"
      onClick={() => {
        setInit(true)
        setNow(Date.now())
      }}
      disabled={init || session === null || !(selection.length > 0)}
    >
      Iniciar
    </button>
  )
}

export default InitButton
