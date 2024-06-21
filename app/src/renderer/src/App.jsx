import Versions from './components/Versions.jsx'
import { Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'

// TODO: Need to import necessary modules for Chart.js only
import Chart from 'chart.js/auto'

// Test: Importing and using collection
import RTCollection from './components/RTCollection.jsx'
import SessionSelection from './components/SessionSelection.jsx'
import PauseButton from './components/PauseButton.jsx'

//import test context for session
import { useSessionStore } from './context/SessionContext'
import { useSelectionStore } from './context/SelectionContext.js'

// Size variables (vh and vw)
let sectionWidth = 30
let mainWidth = 100 - sectionWidth
let controlHeight = 15
let mainHeight = 100 - controlHeight

// Test: frequency of data update
let frequency = 1000

function App() {
  const session = useSessionStore((state) => state.session)
  const selection = useSelectionStore((state) => state.selections)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    // Test: Add entries to data
    let graphInterval = setInterval(() => {
      if (!pause) {
        updateData(performanceData)
      }
      updateData(safetyData)
    }, frequency)

    return () => clearInterval(graphInterval)
  }, [pause])


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

      {selection != null ? <h1>la seleccion actual es {selection}</h1> : <h1>no hay seleccion</h1>}
      <SessionSelection />
      <PauseButton pause={pause} setPause={setPause} />
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

// Methods
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

let performanceData = dataInit(performanceSelection)
let safetyData = dataInit(safetySelection)

// Test: pause data update
let pause = false

// Test: Time data
// NOTE: This updates the data in the first second to simulate the first reading
let now = Date.now()
updateData(safetyData)
updateData(performanceData)

async function updateData(data) {
  let newData = await readAPI.readData()
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

export default App
