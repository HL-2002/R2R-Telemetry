import { useSessionStore } from "../context/SessionContext"

export default function Run({ mode, index, run }) {
  const setEntry = useSessionStore((state) => state.setEntry)
  const min = Math.floor(run?.duration / 60000)
  const sec = Math.floor((run?.duration % 60000) / 1000)
  const ms = Math.floor(run?.duration % 1000)

  const handleClick = async () => {
    const entries = await api.getEntryByRun(run.id)
    setEntry(entries)
  }

  return (
    <button
      className="m-1 p-2
                        bg-[#e94926]
                        rounded-md
                        text-[#dee4ea]
                        shadow-2xl
                        shadow-slate-900
                        hover:bg-[#ec6d2d]
                        disabled:opacity-50"
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
