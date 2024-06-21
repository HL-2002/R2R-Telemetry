function NewButton({ init, run, setRun }) {
  const handleClick = () => {
    setRun(run + 1)
  }

  return (
    <button
      onClick={handleClick}
      className="
                m-2 p-2
                bg-[#e94926]
                rounded
                text-[#dee4ea]
                hover:bg-[#ec6d2d]
                disabled:opacity-50
            "
      disabled={!init}
    >
      Nuevo intento
    </button>
  )
}

export default NewButton
