import { useRef, useState } from 'react'
import Dialog from '../Dialog'
import { MenuPage } from './MenuPage'
import { LoadSession } from './Loadsession'
import { NewSession } from './NewSession'

export default function SessionSelection() {
  const [page, setPage] = useState(0)
  const ref = useRef()

  return (
    <>
      <button
        className="
        m-2
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
        {page === 0 ? <MenuPage changePage={setPage} /> : null}
        {page === 1 ? <NewSession /> : null}
        {page === 2 ? <LoadSession /> : null}
        {page === 3 ? <LoadSession multiple /> : null}
        {page === 4 ? <LoadSession toDelete /> : null}
      </Dialog>
    </>
  )
}

// const Allgraph = ['velocity', 'rpms', 'gear', 'lateral_g', 'throttle', 'brake', 'steering_angle']