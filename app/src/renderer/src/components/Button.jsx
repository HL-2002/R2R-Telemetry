export default function Button({ name, click, type = 'normal' }) {
  return (
    <button
      onClick={click}
      className={`border  p-2 transition-colors rounded ${
        type != 'normal' ? 'bg-red-500 text-white' : 'bg-white text-black'
      }`}
    >
      {name}
    </button>
  )
}
