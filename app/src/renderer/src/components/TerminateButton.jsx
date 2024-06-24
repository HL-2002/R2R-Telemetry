function TerminateButton({ terminate, setTerminate, init }) {
  return (
    <button
      className="m-2 p-2
                bg-[#e94926]
                rounded
                text-[#dee4ea]
                hover:bg-[#ec6d2d]
                disabled:opacity-50"
      onClick={() => setTerminate(true)}
      disabled={!terminate}
    >
      Terminar
    </button>
  )
}

export default TerminateButton
