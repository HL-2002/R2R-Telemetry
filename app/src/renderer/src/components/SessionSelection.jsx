import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog'

const DATA_DEMO = [
  {
    id: 1,
    name: 'Session 1',
    date: '2021-09-01',
    time: '10:00',
    type: 'Aceleracion'
  },
  {
    id: 2,
    name: 'Session 2',
    date: '2021-09-01',
    time: '15:00',
    type: 'Arranque'
  },
  {
    id: 3,
    name: 'Session 3',
    date: '2021-09-01',
    time: '20:00',
    type: 'Frenado'
  },
  {
    id: 4,
    name: 'Session 4',
    date: '2021-09-02',
    time: '10:00',
    type: 'Aceleracion'
  },
  {
    id: 5,
    name: 'Session 5',
    date: '2021-09-02',
    time: '15:00',
    type: 'Arranque'
  },
  {
    id: 6,
    name: 'Session 6',
    date: '2021-09-02',
    time: '20:00',
    type: 'Frenado'
  },
  {
    id: 7,
    name: 'Session 7',
    date: '2021-09-03',
    time: '10:00',
    type: 'Aceleracion'
  },
  {
    id: 8,
    name: 'Session 8',
    date: '2021-09-03',
    time: '15:00',
    type: 'Arranque'
  },
  {
    id: 9,
    name: 'Session 9',
    date: '2021-09-03',
    time: '20:00',
    type: 'Frenado'
  },
  {
    id: 10,
    name: 'Session 10',
    date: '2021-09-04',
    time: '10:00',
    type: 'Aceleracion'
  },
  {
    id: 11,
    name: 'Session 11',
    date: '2021-09-04',
    time: '15:00',
    type: 'Arranque'
  },
  {
    id: 12,
    name: 'Session 12',
    date: '2021-09-04',
    time: '20:00',
    type: 'Frenado'
  },
  {
    id: 13,
    name: 'Session 13',
    date: '2021-09-05',
    time: '10:00',
    type: 'Aceleracion'
  },
  {
    id: 14,
    name: 'Session 14',
    date: '2021-09-05',
    time: '15:00',
    type: 'Arranque'
  }
]

export default function SessionSelection() {
  const [page, setPage] = useState(0)
  const ref = useRef()

  return (
    <>
      <button
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
      <SessionButton>Borrar Sesion</SessionButton>
    </div>
  )
}

function LoadSession({ multiple = false }) {
  const [data, setData] = useState([])
  const [selected, setSelected] = useState([])

  useEffect(() => {
    api.getAllSessions().then((data) => setData(data))
  }, [])

  const handleSelect = (id) => {
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
      <button className="absolute right-7 -bottom-4 p-2 bg-[#e94926] rounded text-[#dee4ea] hover:bg-[#ec6d2d]">
        Cargar
      </button>
    </div>
  )
}

function NewSession() {
  return (
    <div className="grid grid-cols-2 ">
      <div
        className="
  p-4
  flex flex-col
  border-r border-r-[#454f59]
"
      >
        <ButtonEventMenu>Aceleracion</ButtonEventMenu>
        <ButtonEventMenu>Skidpad</ButtonEventMenu>
        <ButtonEventMenu>autocross</ButtonEventMenu>
        <ButtonEventMenu>resistencia</ButtonEventMenu>
        <ButtonEventMenu>Personalizable</ButtonEventMenu>
      </div>

      <dir
        className="
      p-4
      flex flex-col
      relative

      "
      >
        <h3 className="text-xl text-[#dee4ea]">Data point</h3>

        <button
          className="
        p-2
        bg-[#e94926]
        rounded
        text-[#dee4ea]
        hover:bg-[#ec6d2d]

        // aling right - bottom
        absolute
        right-1
        bottom-1
        "
        >
          Ok
        </button>
      </dir>
    </div>
  )
}

function ButtonEventMenu({ children, onClick }) {
  return (
    <button className="p-3 m-2 bg-[#ea3344] rounded text-[#dee4ea] hover:bg-[#e94926]">
      {children}
    </button>
  )
}
