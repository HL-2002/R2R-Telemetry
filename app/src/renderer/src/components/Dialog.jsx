export default function Dialog({ children, isOpen, someRef }) {
  return (
    <dialog
      ref={someRef}
      className="p-6 rounded 
    m-auto
    bg-[#22272b]"
      open={isOpen}
    >
      {children}
    </dialog>
  )
}
