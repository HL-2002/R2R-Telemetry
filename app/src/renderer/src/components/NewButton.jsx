function NewButton({ init, run, pause, setRun }) {

  const handleClick = () => {
    setRun(run + 1)
  }

  return (
    <button
      onClick={handleClick}
      className="
                my-2 mr-4 p-2
                bg-[#e94926]
                rounded
                text-[#dee4ea]
                hover:bg-[#ec6d2d]
                disabled:opacity-50
            "
      disabled={!(init && pause)}
    >
      Nuevo intento
    </button>
  )
}

export default NewButton
