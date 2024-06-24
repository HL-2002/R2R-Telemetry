import { useState, useEffect } from 'react'
import { useSessionStore } from '../../context/SessionContext'

export function LoadSession({ multiple = false, toDelete = false }) {
  const setSession = useSessionStore((state) => state.setSession)
  const [data, setData] = useState([])
  const [selected, setSelected] = useState([])

  useEffect(() => {
    api.getAllSessions().then((data) => setData(data))
  }, [])

  const handleSelect = (id) => {
    // if is previous selected, remove it
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
      return
    }

    if (!multiple) {
      setSelected([id])
      return
    }
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const handleClick = () => {
    if (toDelete) {
      selected.forEach((id) => {
        api.deleteSession(id)
      })
    }

    if (!multiple && !toDelete) {
      setSession(data.find((item) => item.id === selected[0]))
    }
  }

  return (
    <div className="p-8 max-w-xl relative">
      <ul className="flex flex-wrap max-h-80 gap-4 p-2 overflow-x-hidden overflow-y-scroll scroll-hidden">
        {data.map((data) => {
          return (
            <li
              onClick={() => {
                handleSelect(data.id)
              }}
              key={data.id}
              className={`p-2 ${!selected.includes(data.id) ? 'bg-[#ea3344]' : 'bg-[#ec6d2d]'} rounded
          hover:bg-[#ec6d2d] transition-colors
          hover:cursor-pointer
            `}
            >
              <h3 className="text-lg font-bold text-[#dee4ea]">{data.description}</h3>
              <p className="text-[#dee4ea]">Fecha: {data.date}</p>
              <p className="text-[#dee4ea]">Hora: {data.time}</p>
              <p className="text-[#dee4ea]">Tipo: {data.type}</p>
            </li>
          )
        })}
      </ul>
      <button
        onClick={handleClick}
        className="absolute right-7 -bottom-4 p-2 bg-[#e94926] rounded text-[#dee4ea] hover:bg-[#ec6d2d]"
      >
        {/* if is multiple is 'comparar', if is toDelete 'borrar', else 'cargar' */}
        {multiple ? 'Comparar' : toDelete ? 'Borrar' : 'Cargar'}
      </button>
    </div>
  )
}