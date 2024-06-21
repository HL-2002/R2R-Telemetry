import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog'
import { useSessionStore } from '../context/SessionContext'
import { useSelectionStore } from '../context/SelectionContext'

export default function SessionSelection() {
  const [page, setPage] = useState(0)
  const ref = useRef()

  return (
    <>
      <button
        className="
      p-2
      bg-[#e94926]
      rounded
      text-[#dee4ea]
      hover:bg-[#ec6d2d]
      "
        onClick={() => {
          setPage(0)
          ref.current.showModal()
        }}
      >
        Selecionar Sesion
      </button>
      <Dialog isOpen={false} someRef={ref}>
        {page === 0 ? <MainPage changePage={setPage} /> : null}
        {page === 1 ? <NewSession /> : null}
        {page === 2 ? <LoadSession /> : null}
        {page === 3 ? <LoadSession multiple /> : null}
        {page === 4 ? <LoadSession toDelete /> : null}
      </Dialog>
    </>
  )
}

function SessionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="transition-colors p-2 m-2 bg-[#e94926] rounded text-[#dee4ea] hover:bg-[#ec6d2d]"
    >
      {children}
    </button>
  )
}

function MainPage({ changePage }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold  text-[#dee4ea] mb-4">Selector de sesiones</h2>
      <SessionButton
        onClick={() => {
          changePage(1)
        }}
      >
        Nueva sesion
      </SessionButton>
      <SessionButton
        onClick={() => {
          changePage(2)
        }}
      >
        Cargar sesion
      </SessionButton>
      <SessionButton
        onClick={() => {
          changePage(3)
        }}
      >
        Comparar sesiones
      </SessionButton>
      <SessionButton
        onClick={() => {
          changePage(4)
        }}
      >
        Borrar Sesion
      </SessionButton>
    </div>
  )
}

function LoadSession({ multiple = false, toDelete = false }) {
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
      <ul className="flex flex-wrap max-h-80 gap-4 p-2 overflow-x-hidden overflow-y-scroll">
        {data.map((data, index) => {
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

const Allgraph = ['velocity', 'rpms', 'gear', 'lateral_g', 'throttle', 'brake', 'steering_angle']

const TypesEvents = [
  {
    name: 'Acceleration',
    graph: ['velocity', 'rpms', 'gear', 'throttle']
  },
  {
    name: 'Skidpad',
    graph: ['velocity', 'rpms', 'gear', 'lateral_g', 'throttle', 'brake', 'steering_angle']
  },
  {
    name: 'Autocross',
    graph: ['velocity', 'rpms', 'gear', 'throttle', 'brake', 'steering_angle']
  },
  {
    name: 'Endurance',
    graph: ['velocity', 'rpms', 'gear', 'throttle', 'brake', 'steering_angle']
  }
]

function NewSession() {
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
