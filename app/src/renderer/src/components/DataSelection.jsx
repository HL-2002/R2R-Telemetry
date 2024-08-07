import Dialog from './Dialog'
import { useSessionStore } from '../context/SessionContext'

import { useSelectionStore } from '../context/SelectionContext'
import { useState, useRef, useEffect } from 'react'
import constants from '../constants'
const { Allgraph, AllgraphSafe } = constants

export function DataSelection({ mode }) {
  const session = useSessionStore((state) => state.session)
  // create a reference to the dialog
  const ref = useRef(null)
  // Get the current selections and the setSelection function from the store
  const selections = useSelectionStore((state) => state.selections)
  const safeSelections = useSelectionStore((state) => state.safeSelections)

  const setSelection = useSelectionStore((state) => state.setSelection)
  const setSafeSelection = useSelectionStore((state) => state.setSafeSelection)
  const setAxisStore = useSelectionStore((state) => state.setAxis)
  const [current, setCurrent] = useState([])
  const [Available, setAvailable] = useState(Allgraph)
  const [safeAvailable, setSafeAvailable] = useState(AllgraphSafe)
  const [axis, setAxis] = useState('time')
  // Update the current selection when the selections change
  useEffect(() => {
    if (mode == 'read') {
      // render selections and safeAvailable
      setCurrent([...selections, ...safeSelections])
      return
    }
    setCurrent(selections)
  }, [selections, mode])
  // Update the available selection when the current selection changes
  useEffect(() => {
    setAvailable(Allgraph.filter((item) => !current.includes(item)))
    if (mode == 'read') setSafeAvailable(AllgraphSafe.filter((item) => !current.includes(item)))
  }, [current])

  // Handle the selection of an item
  const handleSelect = (item) => {
    if (current.includes(item)) {
      setCurrent(current.filter((i) => i !== item))
    } else {
      setCurrent([...current, item])
    }
  }

  // Handle the click event
  const handleClick = () => {
    const performance = current.filter((item) => Allgraph.includes(item))
    setSelection(performance)
    setAxisStore(axis)
    if (mode == 'read') {
      const safety = current.filter((item) => AllgraphSafe.includes(item))
      setSafeSelection(safety)
    }
  }

  return (
    <>
      <button
        className=" my-2 mr-4
        p-2
        bg-[#e94926]
        rounded
        text-[#dee4ea]
        hover:bg-[#ec6d2d]
        disabled:opacity-50"
        onClick={() => {
          // Show the dialog
          ref.current.showModal()
        }}
        disabled={session === null}
      >
        Cambiar selección
      </button>
      <Dialog isOpen={false} someRef={ref}>
        <div className="grid grid-cols-2 gap-4 relative">
          <div>
            <h2 className="text-xl  text-[#dee4ea] font-bold ">Puntos actuales</h2>

            <ul className="flex flex-col gap-1 min-h-60 max-h-60 overflow-y-scroll scroll-hidden">
              {current.map((item) => {
                return (
                  <li
                    className="text-[#dee4ea]  text-lg hover:cursor-pointer hover:text-[#ea3344]"
                    key={item}
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </li>
                )
              })}
            </ul>
            <h3 className="text-xl text-[#dee4ea] mb-2 font-bold">Eje X</h3>
            <div className="flex flex-col text-[#dee4ea] gap-2">
              <label
                onClick={() => {
                  setAxis('distance')
                }}
                className="flex gap-2"
              >
                <input type="radio" name="axis" />
                <span> Distancia</span>
              </label>
              <label
                onClick={() => {
                  setAxis('time')
                }}
                className="flex gap-2"
              >
                <input type="radio" name="axis" defaultChecked />
                <span> Tiempo</span>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-xl    text-[#dee4ea] font-bold">Puntos Disponibles Redimiento</h2>
            <ul className="flex flex-col min-h-60 max-h-60  gap-1 overflow-y-scroll scroll-hidden">
              {Available.map((item) => {
                return (
                  <li
                    className="text-[#ea3344]  text-lg hover:cursor-pointer hover:text-[#dee4ea] "
                    key={item}
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </li>
                )
              })}
            </ul>
            {mode == 'read' ? (
              <>
                <h2 className="text-xl  text-[#dee4ea] font-bold">Puntos Disponibles Seguridad</h2>

                <ul className="flex flex-col min-h-60 max-h-60 gap-1 overflow-y-scroll scroll-hidden">
                  {safeAvailable.map((item) => {
                    return (
                      <li
                        className="text-[#ea3344]  text-lg hover:cursor-pointer hover:text-[#dee4ea] "
                        key={item}
                        onClick={() => handleSelect(item)}
                      >
                        {item}
                      </li>
                    )
                  })}
                </ul>
              </>
            ) : null}

            <button
              className="  
        absolute
        right-0
        bottom-0
             
        p-2 bg-[#e94926]
        rounded
        text-[#dee4ea]
        hover:bg-[#ec6d2d]"
              onClick={handleClick}
            >
              Modificar
            </button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
