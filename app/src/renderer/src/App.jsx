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
import RunCollection from './components/RunCollection.jsx'

// Import contexts
import { useSessionStore } from './context/SessionContext'
import { useSelectionStore } from './context/SelectionContext.js'
import { DataSelection } from './components/DataSelection.jsx'

// Size variables (vh and vw)
let controlHeight = 10
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
/*
  The idea is to have two data collections that are updated in real-time, one for performance
  and one for safety. The data is updated every frequency milliseconds, and the data is filtered
  based on the selection made by the user. 

  The filtered data is then displayed in the RTCollection component, which is updated every time
  the selection changes, the axis changes, or a new run is started.
*/
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
  // Mode (log, read) depends on the session selected, new session logs, and existing session reads
  const setRunGlobal = useSessionStore((state) => state.setRuns)
  const addRunGlobal = useSessionStore((state) => state.addRun)

  const [mode, setMode] = useState('')
  const [updateTime, setUpdateTime] = useState(Date.now())

  // for runs
  const [runDb, setRunDb] = useState(null)
  const [time, setTime] = useState(null)

  // Set the selection based on session type
  useEffect(() => {
    if (session == null) return
    const sele = TypesEvents.find((item) => item.name === session?.type)?.graph || []
    setSelection(sele)
    // TODO: Change safetyEntries for the actual safety selection with the components
    setSafetySelection(safetyEntries)

    api.getRunBySession(session.id).then((res) => {
      setRunGlobal(res)
    })
    setRun(0)
  }, [session])

  // Update data labels upon selection, axis change, and new run
  /* 
    NOTE: Even though is not as efficient to update the x labels whenever a data selection 
    changes, or the other way around; separating label change and data filter based on selection,
    updates the x labels, but doesn't update the plot's x axis, as both selectionData 
    (the filtered data the plots use) don't have the chance to be updated until selection changes.
  */
  useEffect(() => {
    // Set labels based on axis
    if (Axis === 'time') {
      performanceData.labels = performanceTimeLabels
      safetyData.labels = safetyTimeLabels
    } else if (Axis === 'distance') {
      performanceData.labels = performanceDistanceLabels
      safetyData.labels = safetyDistanceLabels
    }

    performanceSelectionData = filterData(performanceData, selection)
    safetySelectionData = filterData(safetyData, safetySelection)
    // Refresh component
    setUpdateTime(Date.now())
  }, [run, selection, safetySelection, Axis])

  // Every time the run changes, update the duration in db
  useEffect(() => {
    if (runDb == null) return
    const duration = Date.now() - time
    api.UpdateRun({ id: runDb.id, duration: duration, hour: runDb.hour }).then((res) => {
      addRunGlobal(res)
      // clean runDb for preventing multiple updates
      setRunDb(null)
    })
  }, [run])
  // Create a new run in the database upon initialization
  useEffect(() => {
    if (init == true) {
      api.CreateRun({ session_id: session.id }).then((res) => {
        setRunDb(res)
        setTime(Date.now())
      })
    }
  }, [init])

  // Update data every frequency milliseconds based on variables current state
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
        setMode('log')
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
          newData = await readAPI.logData({ run_id: runDb?.id })
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
  }, [init, pause, terminate, runDb])

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
      <div className="flex w-screen">
        <div
          id="SIDEBAR"
          className="bg-[#1d2125]
                        p-6
                        w-56
                        h-screen
                        text-center
                        flex
                        flex-col"
        >
          <img src="./src/assets/app-logo.png" alt="R2R Telemetría" className="pb-2" />
          <SessionSelection />
          <RunCollection mode={mode} />
        </div>

        <div
          id="MAIN"
          className="bg-[#161a1d]
                        p-6
                        flex-grow
                        min-w-0"
        >
          {session != null ? (
            <div id="CONTROL" style={{ height: controlHeight + 'vh' }} className="mb-1">
              <h1 className="font-black">
                {session?.description} - {session?.type} : Intento Nro {run}
              </h1>
              <div className="flex">
                <DataSelection />
                <InitButton init={init} setInit={setInit} setNow={setNow} selection={selection} />
                <PauseButton pause={pause} setPause={setPause} init={init} terminate={terminate} />
                <NewButton init={init} run={run} pause={pause} setRun={setRun} />
                <TerminateButton
                  terminate={terminate}
                  setTerminate={setTerminate}
                  init={init}
                  setMode={setMode}
                />
              </div>
            </div>
          ) : (
            <> </>
          )}

          <div className="flex">
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
        </div>
      </div>
    </>
  )
}

export default App
