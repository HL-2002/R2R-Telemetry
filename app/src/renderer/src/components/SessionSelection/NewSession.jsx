import { useState } from 'react'
import { useSessionStore } from '../../context/SessionContext'
import toast from 'react-hot-toast'

import constants from '../../constants'

const { TypesEvents } = constants

export function NewSession() {
  const [selected, setSelected] = useState('')
  const setSession = useSessionStore((state) => state.setSession)

  const handleSelect = async (event) => {
    const form = new FormData(event.target)
    if (!selected) {
      toast.error('Seleccione un tipo de sesion')
      return
    }

    if (!form.get('name') || !form.get('cedula')) {
      toast.error('Ingrese los datos faltantes')
    }

    const session = await api.CreateSession({
      type: selected,
      name: form.get('name'),
      cedula: form.get('cedula')
    })
    if (session?.error) {
      toast.error('Cedula cliente no encontrada')
      return
    }
    toast.success('Sesion creada con exito')
    setSession(session)
  }

  return (
    <div className="grid grid-cols-3 ">
      <div
        className="
  p-4
  flex flex-col
  border-r border-r-[#454f59]
"
      >
        {TypesEvents.map((item) => {
          return (
            <ButtonEventMenu
              key={item.name}
              selected={selected}
              setSeleted={setSelected}
              name={item.name}
            />
          )
        })}
      </div>

      <dir
        className="
      p-4
      flex flex-col
      relative

      "
      >
        <h3 className="text-xl text-[#dee4ea]">Data point</h3>

        <ul>
          {TypesEvents.find((item) => item.name === selected)?.graph.map((item) => {
            return (
              <li key={item} className="text-white text-s">
                <span className="mr-2">•</span>
                {item}
              </li>
            )
          })}
        </ul>
      </dir>

      <form onSubmit={handleSelect} className="flex flex-col gap-2 text-[#dee4ea]">
        <label className="flex flex-col gap-2">
          Nombre de la sesion
          <input type="text" name="name" className="text-black p-1 rounded" />
        </label>
        <label className="flex flex-col gap-2">
          Cedula cliente
          <input type="text" name="cedula" className="text-black p-1 rounded" />
        </label>

        <button
          className="
        p-2
        bg-[#e94926]
        rounded
        text-[#dee4ea]
        hover:bg-[#ec6d2d]

        // aling right - bottom
        absolute
        right-8
        bottom-8
        "
        >
          Ok
        </button>
      </form>
    </div>
  )
}

function ButtonEventMenu({ selected, setSeleted, name }) {
  return (
    <label
      onClick={() => {
        setSeleted(name)
      }}
      className={`p-2 hover:cursor-pointer text-center m-2 ${selected == name ? 'bg-[#e94926]' : 'bg-[#ea3344]'} rounded text-[#dee4ea] hover:bg-[#e94926]`}
    >
      {name}
      <input type="radio" className="hidden" />
    </label>
  )
}
