function InitButton ({init, setInit, setNow}) {

    return (
        <button className='m-2 p-2
                bg-[#e94926]
                rounded
                text-[#dee4ea]
                hover:bg-[#ec6d2d]
                disabled:opacity-50' 
                onClick={() => {setInit(true); setNow(Date.now())} }
                disabled={init}> 
            Iniciar
        </button>
    );
}

export default InitButton;