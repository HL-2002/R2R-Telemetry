function PauseButton({ pause, setPause, init, terminate }) {
  return (
    <button
      className="m-2 p-2
                bg-[#e94926]
                rounded
                text-[#dee4ea]
                hover:bg-[#ec6d2d]
                disabled:opacity-50"
      onClick={() => setPause(!pause)}
      disabled={!init || terminate}
    >
      {pause ? 'Reanudar' : 'Pausar'}
    </button>
  )
}

export default PauseButton
