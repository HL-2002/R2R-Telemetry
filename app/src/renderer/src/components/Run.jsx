export default function Run({ mode, index, run }) {
//   run have a atribute duration xd use it
    return (
    <button
      className="m-1 p-2
                        bg-[#e94926]
                        rounded-md
                        text-[#dee4ea]
                        shadow-2xl
                        shadow-slate-900
                        hover:bg-[#ec6d2d]
                        disabled:opacity-50"
      style={{ width: 95 + '%' }}
      onClick={() => {}}
      disabled={mode !== 'read'}
    >
      <h1 className="text-left">Run {index}#</h1>
      <div className="flex justify-between">
        <p className="text-sm"> HH:MM </p>
        <p className="text-sm"> MM:SS:MSS </p>
      </div>
    </button>
  )
}
