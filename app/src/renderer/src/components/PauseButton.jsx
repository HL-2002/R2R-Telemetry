import {useState} from 'react';

function PauseButton (props) {

    return (
        <button className='m-2 p-2
                bg-[#e94926]
                rounded
                text-[#dee4ea]
                hover:bg-[#ec6d2d]' 
                onClick={() => props.setPause(!props.pause)}> 
            {props.pause ? "Continuar" : "Pausar"} 
        </button>
    );
}

export default PauseButton;