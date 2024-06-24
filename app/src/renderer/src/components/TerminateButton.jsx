function TerminateButton({ terminate, setTerminate, init }) {
  return (
    <button
      className="m-2 p-2
                bg-[#ea3344]
                rounded
                text-[#dee4ea]
                hover:bg-[#f63e50]
                disabled:opacity-50"
      onClick={() => setTerminate(true)}
      disabled={!init}
    >
      Terminar
    </button>
  )
}

export default TerminateButton
