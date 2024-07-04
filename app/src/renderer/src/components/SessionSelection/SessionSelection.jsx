import { useRef, useState } from 'react'
import Dialog from '../Dialog'
import { MenuPage } from './MenuPage'
import { LoadSession } from './Loadsession'
import { NewSession } from './NewSession'

export default function SessionSelection({ setMode, mode, terminate, init }) {
  const [page, setPage] = useState(0)
  const ref = useRef()

  return (
    <>
      <button
        className="
        mt-2
        p-2
        mb-4
        bg-[#e94926]
        rounded-lg
        text-[#dee4ea]
        hover:bg-[#ec6d2d]
        disabled:opacity-50
        "
        style={{ width: 100 + '%' }}
        disabled={mode === 'log' && !terminate && init}
        onClick={() => {
          setPage(0)
          ref.current.showModal()
        }}
      >
        Selecionar Sesión
      </button>
      <Dialog isOpen={false} someRef={ref}>
        {page === 0 ? <MenuPage changePage={setPage} /> : null}
        {page === 1 ? <NewSession setMode={setMode}/> : null}
        {page === 2 ? <LoadSession setMode={setMode}/> : null}
        {page === 3 ? <LoadSession toDelete /> : null}
      </Dialog>
    </>
  )
}
