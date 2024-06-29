import { useSessionStore } from '../context/SessionContext'
import Run from './Run'

export default function RunCollection({ mode }) {
  const runs = useSessionStore((state) => state.Runs)
  return (
    <div
      // why you make this with inline styles? you can use tailwindcss classes
      style={{ height: 75 + 'vh', overflowY: 'scroll', overflowX: 'hidden' }}
      className="rounded-lg
                        bg-[#282e33]
                        p-2
                        flex-grow"
    >
      {runs.map((run, index) => (
        <Run key={run.id} index={index} run={run} mode={mode} />
      ))}
    </div>
  )
}
