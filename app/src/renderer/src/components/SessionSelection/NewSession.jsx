import { useState } from 'react'
import { useSessionStore } from '../../context/SessionContext'
import toast from 'react-hot-toast'

import constants from '../../constants'
//  Constants of the types of events graph
const { TypesEvents } = constants

export function NewSession({ setMode }) {
  //  state to control the selected type of session
  const [selected, setSelected] = useState('')
  // to set the session in the global state
  const setSession = useSessionStore((state) => state.setSession)

  // method to handle the submit of the form
  const handleSelect = async (event) => {
    // get the form data
    const form = new FormData(event.target)
    // if there is no type of session selected, show a notification
    if (!selected) {
      toast.error('Seleccione un tipo de sesión')
      return
    }

    // if there is no name or cedula, show a notification
    if (!form.get('name')) {
      toast.error('Ingrese los datos faltantes')
      return
    }

    //  if the name is greater than 20 characters, show a notification
    if (form.get('name').length > 20) {
      toast.error('Nombre mayor a 20 caracteres')
      return
    }

    //  create the session in the api
    const session = await api.CreateSession({
      type: selected,
      name: form.get('name')
    })
    // if there is an error, show a notification
    if (session?.error) {
      toast.error('Hubo un error al crear la sesión')
      return
    }
    // show a notification of success
    toast.success('Sesion creada con éxito')
    //
    setSession(session)
    setMode('log')
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
        {
          //  map the types of events to create the buttons
          TypesEvents.map((item) => {
            return (
              <ButtonEventMenu
                key={item.name}
                selected={selected}
                setSeleted={setSelected}
                name={item.name}
              />
            )
          })
        }
      </div>

      <dir
        className="
      p-4
      flex flex-col
      relative

      "
      >
        <h3 className="text-xl text-[#dee4ea] font-bold">Data point</h3>

        <ul className="text-left p-3">
          {
            //  map the graph of the selected type of event to show the data points
            TypesEvents.find((item) => item.name === selected)?.graph.map((item) => {
              return (
                <li key={item} className="text-white text-s">
                  <span className="mr-2">•</span>
                  {item}
                </li>
              )
            })
          }
        </ul>
      </dir>

      <form onSubmit={handleSelect} className="flex flex-col gap-2 text-[#dee4ea]">
        <label className="flex flex-col gap-2">
          Nombre de la sesión
          <input type="text" name="name" className="text-black p-1 rounded" />
        </label>

        <button
          className="
        p-2
        bg-[#e94926]
        rounded
        text-[#dee4ea]
        hover:bg-[#ec6d2d]

        // align right - bottom
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
// this is the button to select the type of event
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
