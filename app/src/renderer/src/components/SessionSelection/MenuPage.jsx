export function MenuPage({ changePage }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold  text-[#dee4ea] mb-4">Selector de sesiones</h2>
      <SessionButton
        onClick={() => {
          changePage(1)
        }}
      >
        Nueva sesión
      </SessionButton>
      <SessionButton
        onClick={() => {
          changePage(2)
        }}
      >
        Cargar sesión
      </SessionButton>
      <SessionButton
        onClick={() => {
          changePage(3)
        }}
      >
        Comparar sesiones
      </SessionButton>
      <SessionButton
        onClick={() => {
          changePage(4)
        }}
      >
        Borrar sesión
      </SessionButton>
    </div>
  )
}

function SessionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="transition-colors p-2 m-2 bg-[#e94926] rounded text-[#dee4ea] hover:bg-[#ec6d2d]"
    >
      {children}
    </button>
  )
}
