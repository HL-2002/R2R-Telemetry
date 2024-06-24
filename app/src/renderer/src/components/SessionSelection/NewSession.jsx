import { useState } from 'react'
import { useSelectionStore } from '../../context/SelectionContext'
import constants from '../../constants'

const { TypesEvents } = constants

export function NewSession() {
  const [selected, setSelected] = useState('')
  const setSelection = useSelectionStore((state) => state.setSelection)

  const handleSelect = () => {
    const sel = TypesEvents.find((item) => item.name === selected).graph
    setSelection(sel)
  }

  return (
    <div className="grid grid-cols-2 ">
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

        <button
          onClick={handleSelect}
          className="
        p-2
        bg-[#e94926]
        rounded
        text-[#dee4ea]
        hover:bg-[#ec6d2d]

        // aling right - bottom
        absolute
        right-1
        -bottom-1
        "
        >
          Ok
        </button>
      </dir>
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
