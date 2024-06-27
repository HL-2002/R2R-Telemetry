import { useEffect, useState } from 'react'

// TODO: Need to import necessary modules for Chart.js only
import Chart from 'chart.js/auto'
// For notifications
import { Toaster } from 'react-hot-toast'

// Constants
import constants from './constants.js'
const { TypesEvents } = constants

// Component imports
import RTCollection from './components/RTCollection.jsx'
import SessionSelection from './components/SessionSelection/SessionSelection.jsx'
import PauseButton from './components/PauseButton.jsx'
import InitButton from './components/InitButton.jsx'
import NewButton from './components/NewButton.jsx'
import TerminateButton from './components/TerminateButton.jsx'

// Import contexts
import { useSessionStore } from './context/SessionContext'
import { useSelectionStore } from './context/SelectionContext.js'
import { DataSelection } from './components/DataSelection.jsx'

// Size variables (vh and vw)
let sectionWidth = 30
let mainWidth = 100 - sectionWidth
let controlHeight = 15
let mainHeight = 95 - controlHeight

// Frequency of data update
// NOTE: The lesser it is, the more precise the distance plot will be, but the more
// data will be stored and displayed, which can slow down the app.
let frequency = 100

// Data creation and handling

// Data selection variables
// WARNING: safetyEntries gotta have tire_pressure entries together, so that the dataInit
// and dataUpdate functions work
// WARNING: the selection items must match the API data entries, to maintain consistency
// across the app, the API and the DB.
let safetyEntries = [
  'tire_pressure_fl',
  'tire_pressure_fr',
  'tire_pressure_rl',
  'tire_pressure_rr',
  'fuel',
  'temperature',
  'oil_pressure'
]

let performanceEntries = [
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

  for (let i = 0; i < dataSelection.length; i++) {
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
let performanceData = dataInit(performanceEntries)
let safetyData = dataInit(safetyEntries)
let performanceSelectionData = { labels: [], datasets: [] }
let safetySelectionData = { labels: [], datasets: [] }

let performanceTimeLabels = []
let performanceDistanceLabels = []
let safetyTimeLabels = []
let safetyDistanceLabels = []

function App() {
  const session = useSessionStore((state) => state.session)
  const selection = useSelectionStore((state) => state.selections)
  const [safetySelection, setSafetySelection] = useState([])
  const setSelection = useSelectionStore((state) => state.setSelection)
  const Axis = useSelectionStore((state) => state.Axis)
  const [pause, setPause] = useState(false)
  const [init, setInit] = useState(false)
  const [now, setNow] = useState(0)
  const [run, setRun] = useState(0)
  const [terminate, setTerminate] = useState(false)
  // Mode depends on the session selected, new session logs, and existing session reads
  const [mode, setMode] = useState('')
  const [updateTime, setUpdateTime] = useState(Date.now())

  // for runs
  const [runDb, setRunDb] = useState(null)
  const [time, setTime] = useState(null)

  //read the code and you will understand what this does
  useEffect(() => {
    if (run == 0) return
    const duration = Date.now() - time
    api.UpdateRun({ id: runDb.id, duration: duration }).then((res) => {
    })
  }, [run])

  // Update data every frequency milliseconds
  useEffect(() => {
    // 1st data update at the beginning
    /* 
      Needs to be defined as function and then called right away to be able to 
      perform async operations within the useEffect hook
    */
    async function fetchData() {
      if (init && !pause && performanceData.labels.length === 0) {
        let newData = await readAPI.initDataLog()
        updateLabels(performanceTimeLabels, performanceDistanceLabels, newData)
        updateLabels(safetyTimeLabels, safetyDistanceLabels, newData)
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
          updateLabels(performanceTimeLabels, performanceDistanceLabels, newData)
          updateData(newData, performanceData)
        } else {
          newData = await readAPI.readData()
        }
        updateLabels(safetyTimeLabels, safetyDistanceLabels, newData)
        updateData(newData, safetyData)
      }
    }, frequency)

    // Clear interval when the component is unmounted
    return () => clearInterval(graphInterval)
  }, [init, pause, terminate])

  // Reset data upon new run when the component is reloaded
  useEffect(() => {
    return () => {
      setInit(false)
      setPause(false)
      performanceData = dataInit(performanceEntries)
      safetyData = dataInit(safetyEntries)
      performanceTimeLabels = []
      performanceDistanceLabels = []
      safetyTimeLabels = []
      safetyDistanceLabels = []
    }
  }, [run])

  // Update data upon selection, axis change, and new run
  useEffect(() => {
    // Set labels based on axis
    if (Axis === 'time') {
      performanceData.labels = performanceTimeLabels
      safetyData.labels = safetyTimeLabels
    } else if (Axis === 'distance') {
      performanceData.labels = performanceDistanceLabels
      safetyData.labels = safetyDistanceLabels
    }
    // Filter data based on selection
    performanceSelectionData = filterData(performanceData, selection)
    safetySelectionData = filterData(safetyData, safetySelection)
    // Refresh component
    setUpdateTime(Date.now())
  }, [run, selection, Axis])

  // TODO: comment your things Luis :D [eat my balls]
  useEffect(() => {
    const sele = TypesEvents.find((item) => item.name === session?.type)?.graph || []
    setSelection(sele)
    // TODO: Change safetyEntries for the actual safety selection with the components
    setSafetySelection(safetyEntries)
  }, [session])


  // this make something for the run xd documentation level god
  useEffect(() => {
    if (init == true) {
      api.CreateRun({ session_id: session.id }).then((res) => {
        setRunDb(res)
        setTime(Date.now())
      })
    }
  }, [init])

  // Data update and filter functions
  function updateData(newData, data) {
    for (let i = 0; i < data.datasets.length; i++) {
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

  function updateLabels(timeLabels, distanceLabels, newData) {
    let time = Date.now() - now
    timeLabels.push(Math.floor(time / 1000)) // ms to seconds

    let speed = (newData['velocity'] * 1e3) / 3600 // km/h to m/s
    let dt = frequency / 1000 // ms to seconds
    // distance as the Riemman sum of the speed times the interval of given speed
    if (distanceLabels.length === 0) {
      distanceLabels.push(speed * dt)
    } else {
      distanceLabels.push(speed * dt + distanceLabels[distanceLabels.length - 1])
    }
  }

  function filterData(data, selection) {
    let filteredData = {
      labels: data.labels,
      datasets: []
    }

    if (selection.length > 0) {
      filteredData.datasets = data.datasets.filter((dataset) => selection.includes(dataset.label))
    }

    return filteredData
  }

  // Component
  return (
    <>
      <Toaster />
      {session != null ? (
        <h1>
          la sesion actual activa es: {session?.description} con id {session?.id.toString()} y tipo{' '}
          {session?.type}
        </h1>
      ) : (
        <h1>no hay session</h1>
      )}
      <h3> Intento Nro{run}</h3>

      <div className="flex flex-row border-8" style={{ width: mainWidth + 'vw' }}>
        <SessionSelection />
        <DataSelection />
        <InitButton init={init} setInit={setInit} setNow={setNow} selection={selection} />
        <PauseButton pause={pause} setPause={setPause} init={init} />
        <NewButton init={init} run={run} pause={pause} setRun={setRun} />
        <TerminateButton terminate={terminate} setTerminate={setTerminate} init={init} />
      </div>

      <div className="flex flex-row border-8" style={{ width: mainWidth + 'vw' }}>
        <RTCollection
          data={performanceSelectionData}
          type="performance"
          axis={Axis}
          height={mainHeight}
          frequency={frequency}
          notSafety={safetyEntries.length ? 0 : 1}
        />
        <RTCollection
          data={safetySelectionData}
          type="safety"
          axis={Axis}
          height={mainHeight}
          frequency={frequency}
          notSafety={0}
        />
      </div>
    </>
  )
}

export default App
