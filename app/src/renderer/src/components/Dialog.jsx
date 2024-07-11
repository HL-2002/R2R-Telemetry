export default function Dialog({ children, isOpen, someRef, notX=false }) {
  if (notX) {
    return (
      <dialog
        ref={someRef}
        className="p-6 rounded 
        m-auto
        bg-[#22272b]
        relative
        pt-9
        "
        open={isOpen}
      >
        {children}
      </dialog>
    )
  }

  return (
    <dialog
      ref={someRef}
      className="p-6 rounded 
      m-auto
      bg-[#22272b]
      relative
      pt-9
      "
      open={isOpen}
    >
      <button
        onClick={() => {
          someRef.current.close()
        }}
        className="absolute right-[0.5rem] top-[0.5rem] top py-1 px-2 bg-[#ec6d2d] text-[#dee4ea] rounded text-xs
      hover:bg-[#e94926] hover:text-[#dee4ea] transition-colors
      "
      >
        X
      </button>
      {children}
    </dialog>
  )
}
