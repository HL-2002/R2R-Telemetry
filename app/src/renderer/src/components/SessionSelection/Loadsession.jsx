import { useState, useEffect } from 'react'
// global state session
import { useSessionStore } from '../../context/SessionContext'
// for notifications
import toast from 'react-hot-toast'
/*
Multiple - allow to select multiple sessions
toDelete - only allow to delete sessions selected
setMode - function to set the mode of the session
*/
export function LoadSession({ multiple = false, toDelete = false, setMode }) {
  //session store
  const session = useSessionStore((state) => state.session)
  // set session
  const setSession = useSessionStore((state) => state.setSession)
  // array of sessions in the interface
  const [data, setData] = useState([])
  // array of selected sessions
  const [selected, setSelected] = useState([])

  // when the component mounts, get all the sessions from the db
  useEffect(() => {
    // get all sessions and set in the data state
    api.getAllSessions().then((data) => setData(data))
  }, [])

  // click in a session
  /**
   *
   * @param {number} id  id of the session
   * @returns {void}
   */
  const handleSelect = (id) => {
    // if is previous selected, remove it
    if (selected.includes(id)) {
      // remove from selected state
      setSelected(selected.filter((item) => item !== id))
      return
    }

    //if is not multiple, set the selected session
    if (!multiple) {
      // replace the selected session with the new one
      setSelected([id])
      return
    }
    //  if is multiple, add the session to the selected array
    if (selected.includes(id)) {
      // remove from selected state if is already selected
      setSelected(selected.filter((item) => item !== id))
    } else {
      // add to selected state if is not selected
      setSelected([...selected, id])
    }
  }

  //method to handle the click in the button
  const handleClick = () => {
    // if there is no session selected, show a notification
    if (selected.length === 0) {
      return toast.error('Seleccione una sesion')
    }

    // if is to delete, delete the selected sessions
    if (toDelete) {
      selected.forEach((id) => {
        api.deleteSession(id)
      })
      // detelete from interface
      setData(data.filter((item) => !selected.includes(item.id)))
      // filter the selected sessions
      setSelected(selected.filter((item) => !selected.includes(item)))
      //  if the session is the active session, remove it from the session store to update the interface
      if (session.id == BigInt(selected[0])) {
        setSession(null)
      }
    }

    // if is not multiple and is not to delete,set the session in the session store and load the session data
    if (!multiple && !toDelete) {
      setSession(data.find((item) => item.id === selected[0]))
      setMode('read')
    }

    // if is multiple and is not to delete, set the sessions in the session store and load the sessions data
    if (multiple && !toDelete) {
      if (selected.length < 2) {
        return toast.error('Seleccione al menos dos sesiones')
      }
    }
  }

  return (
    <div className="p-8 max-w-xl relative">
      <ul className="flex flex-wrap max-h-80 gap-4 p-2 overflow-x-hidden overflow-y-scroll scroll-hidden">
        {data
          ? data.map((data) => {
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
            })
          : 'No hay sesiones cargadas'}
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
