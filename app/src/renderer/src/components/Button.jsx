function Button ({ children, disabled = false, onClick}) {
    return (
        <button
          className="my-2 mr-4 p-2
                    bg-[#e94926]
                    rounded
                    text-[#dee4ea]
                    hover:bg-[#ec6d2d]
                    disabled:opacity-50"
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )
    }
    
export default Button