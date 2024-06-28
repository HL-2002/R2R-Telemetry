import Run from './Run'

export default function RunCollection ({mode}) {
    return (
        <div style={{height: 77.5 + 'vh', overflowY: 'scroll', overflowX: 'hidden'}}
                className='rounded-lg
                        bg-[#282e33]
                        p-2'>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
            <Run mode={mode}/>
        </div>
    )
}