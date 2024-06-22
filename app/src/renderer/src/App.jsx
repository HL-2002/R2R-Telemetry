import Versions from './components/Versions.jsx'
import { Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'

// TODO: Need to import necessary modules for Chart.js only
import Chart from 'chart.js/auto'

// Component imports
import RTCollection from './components/RTCollection.jsx'
import SessionSelection from './components/SessionSelection/SessionSelection.jsx'
import PauseButton from './components/PauseButton.jsx'
import InitButton from './components/InitButton.jsx'
import NewButton from './components/NewButton.jsx'
import TerminateButton from './components/TerminateButton.jsx'

// Import context for session
import { useSessionStore } from './context/SessionContext'
import { useSelectionStore } from './context/SelectionContext.js'
import { DataSelection } from './components/DataSelection.jsx'

// Size variables (vh and vw)
let sectionWidth = 30
let mainWidth = 100 - sectionWidth
let controlHeight = 15
let mainHeight = 100 - controlHeight

// Frequency of data update
let frequency = 100

// Data creation and handling

// Data selection variables
// WARNING: safetySelection gotta have tire_pressure entries together, so that the dataInit
// and dataUpdate functions work
// WARNING: the selection items must match the API data entries, to maintain consistency
// across the app, the API and the DB.
let safetySelection = [
  'tire_pressure_fl',
  'tire_pressure_fr',
  'tire_pressure_rl',
  'tire_pressure_rr',
  'fuel',
  'temperature',
  'oil_pressure'
]

let performanceSelection = [
  'velocity',
  'rpms',
  'gear',
  'lateral_g',
  'throttle',
  'brake',
  'steering_angle'
]

// Returns an object with the structure of the data object
/*
data = {
  labels: [],
  datasets: [
    {
      sessionId: 0,
      label: 'velocity',
      data: []
    },
    {
      sessionId: 0,
      label: 'rpms',
      data: []
    },
    ...]
}
*/
function dataInit(dataSelection) {
  let data = {
    labels: [],
    datasets: []
  }

  let n = dataSelection.length

  for (let i = 0; i < n; i++) {
    data.datasets.push({
      sessionId: 0,
      label: dataSelection[i],
      data: []
    })
  }

  return data
}

// Data initialization based on selection
// WARNING: Must be outside the App component to avoid reinitialization
let performanceData = dataInit(performanceSelection)
let safetyData = dataInit(safetySelection)

function App() {
  const session = useSessionStore((state) => state.session)
  const selection = useSelectionStore((state) => state.selections)
  const Axis = useSelectionStore((state) => state.Axis)
  const [pause, setPause] = useState(false)
  const [init, setInit] = useState(false)
  const [now, setNow] = useState(0)
  const [run, setRun] = useState(0)
  const [terminate, setTerminate] = useState(false)

  // Update data every frequency milliseconds
  useEffect(() => {
    // 1st data update at the beginning
    /* 
      Needs to be defined as function and then called right away to be able to 
      perform async operations within the useEffect hook
    */
    async function fetchData() {
      if (init && !pause && performanceData.labels.length === 0) {
        let newData = await readAPI.logData()
        updateData(newData, performanceData)
        updateData(newData, safetyData)
      }
    }

    fetchData()

    // Data update every frequency milliseconds
    /* 
      GLITCH: Pausing and continuing the reading calls for a new data update, and when the action
      is offset by a few milliseconds (specially when frequency is greater than 500ms), the data 
      update is called twice in a row, which causes the safety plot to graph a new entry immediately
      and having more readings than the performance one.

      As reading is not equal to logging (that is, the data is not saved in a database), and the
      updates are done at different times, data isn't overwritten nor lost, thus data update is not 
      a problem, but it can be confusing when the data is being displayed in real-time.
    */
    let graphInterval = setInterval(async () => {
      if (init && !terminate) {
        let newData = {}
        if (!pause) {
          newData = await readAPI.logData()
          updateData(newData, performanceData)
        } else {
          newData = await readAPI.readData()
        }
        updateData(newData, safetyData)
      }
    }, frequency)

    return () => clearInterval(graphInterval)
  }, [init, pause, terminate])

  // Refresh data upon new run when the component is reloaded
  useEffect(() => {
    return () => {
      setInit(false)
      setPause(false)
      performanceData = dataInit(performanceSelection)
      safetyData = dataInit(safetySelection)
    }
  }, [run])

  function updateData(newData, data) {
    let n = data.datasets.length
    let time = Date.now() - now
    data.labels.push(Math.floor(time / 1000))
    for (let i = 0; i < n; i++) {
      if (data.datasets[i].label === 'tire_pressure_fl') {
        data.datasets[i].data.push(newData['tire_pressure_fl'])
        data.datasets[i + 1].data.push(newData['tire_pressure_fr'])
        data.datasets[i + 2].data.push(newData['tire_pressure_rl'])
        data.datasets[i + 3].data.push(newData['tire_pressure_rr'])
        i += 3
      } else {
        data.datasets[i].data.push(newData[data.datasets[i].label])
      }
    }
  }

  // Component
  return (
    <>
      {session != null ? (
        <h1>
          la sesion actual activa es: {session?.description} con id {session?.id} y tipo{' '}
          {session?.type}
        </h1>
      ) : (
        <h1>no hay session</h1>
      )}

      {selection.length ? (
        <h1>
          la seleccion actual es: {selection} y el eje es: {Axis}
        </h1>
      ) : (
        <h1>no hay seleccion</h1>
      )}
      <h3> Intento Nro{run}</h3>

      <div className="flex flex-row border-8" style={{ width: mainWidth + 'vw' }}>
        <SessionSelection />
        <DataSelection />
        <InitButton init={init} setInit={setInit} now={now} pause={pause} setNow={setNow} />
        <PauseButton pause={pause} setPause={setPause} init={init} />
        <NewButton init={init} setInit={setInit} setPause={setPause} run={run} setRun={setRun} />
        <TerminateButton terminate={terminate} setTerminate={setTerminate} init={init} />
      </div>

      <div className="flex flex-row border-8" style={{ width: mainWidth + 'vw' }}>
        <RTCollection
          data={performanceData}
          height={mainHeight}
          frequency={frequency}
          notSafety={safetySelection.length ? 0 : 1}
          type="performance"
        />
        <RTCollection
          data={safetyData}
          height={mainHeight}
          frequency={frequency}
          notSafety={0}
          type="safety"
        />
      </div>
    </>
  )
}

export default App
