import { useEffect, useState } from 'react'

// For notifications
import { Toaster } from 'react-hot-toast'

// Constants
import constants from './constants.js'
const { TypesEvents } = constants

// Component imports
import RTCollection from './components/RTCollection.jsx'
import SessionSelection from './components/SessionSelection/SessionSelection.jsx'
import TerminateButton from './components/TerminateButton.jsx'
import RunCollection from './components/RunCollection.jsx'
import Button from './components/Button.jsx'
import ExportButton from './components/ExportButton.jsx'

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
      runId: 0,
      label: 'velocity',
      data: []
    },
    {
      runId: 0,
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
      runId: 0,
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

let performanceTimeLabels = []
let performanceDistanceLabels = []
let safetyTimeLabels = []
let safetyDistanceLabels = []

function App() {
  // some global states
  const Axis = useSelectionStore((state) => state.Axis)
  const entries = useSessionStore((state) => state.Entry)
  const selection = useSelectionStore((state) => state.selections)
  const [safetySelection, setSafetySelection] = useState([])
  const session = useSessionStore((state) => state.session)
  const runs = useSessionStore((state) => state.Runs)

  // methods to update the global states
  const addRunGlobal = useSessionStore((state) => state.addRun)
  const setEntries = useSessionStore((state) => state.setEntry)
  const setRunGlobal = useSessionStore((state) => state.setRuns)
  const setSelection = useSelectionStore((state) => state.setSelection)


  // For app control
  const [pause, setPause] = useState(false)
  const [init, setInit] = useState(false)
  const [now, setNow] = useState(0)
  const [run, setRun] = useState(0)
  const [terminate, setTerminate] = useState(false)
  const [updateTime, setUpdateTime] = useState(Date.now())
  const [refresh, setRefresh] = useState(false)
  // Mode (log, read) depends on the app option, new session logs, and existing session reads
  const [mode, setMode] = useState('')

  // For run logging and updating
  const [runDb, setRunDb] = useState(null)
  const [time, setTime] = useState(null)

  // Some variables
  let minRunId = getMin(runs) 

  // HOOKS
  // Update run global state upon session change
  useEffect(() => {
    // Reset entries
    setEntries([])
    // If there is no session, reset some  states
    if (session == null) {
      setRunGlobal([])
      setRun(0)
      return
    }

    // get the Default selection from the default graph based on the session type
    const sele = TypesEvents.find((item) => item.name === session?.type)?.graph || []
    setSelection(sele)
    // TODO: Change safetyEntries for the actual safety selection with the components
    setSafetySelection(safetyEntries)

    // get the runs for the session and set the global state
    api.getRunBySession(session.id).then((res) => {
      setRunGlobal(res)
    })
    //reset the run to 0 when the session changes
    setRun(0)
    setTerminate(false)
  }, [session])

  // Update data labels upon selection, axis change, new run, or plot init
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
    // Refresh component
    setUpdateTime(Date.now())
  }, [run, init, selection, safetySelection, Axis, refresh])

  // Every time the run changes or App is terminated, update the run in the database and update the UI
  useEffect(() => {
    // if there is not exist in the db, return
    if (runDb == null) return
    // calculate the duration and update the run
    const duration = Date.now() - time
    api.UpdateRun({ id: runDb.id, duration: duration, hour: runDb.hour }).then((res) => {
      // add run to Global state to update the UI
      addRunGlobal(res)
      // clean runDb for preventing multiple updates
      setRunDb(null)
    })
  }, [run, terminate])

  // Create a new run in the database upon initialization
  useEffect(() => {
    // if there is no session, return
    if (init == true) {
      // create a new run in the database
      api.CreateRun({ session_id: session.id }).then((res) => {
        // set the runDb
        setRunDb(res)
        //  set the time for the run start
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
        let newData = await readAPI.logData({
          run_id: runDb?.id,
          now: now,
          frequency: frequency,
          prev_distance: 0
        })
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
          newData = await readAPI.logData({
            run_id: runDb?.id,
            now,
            frequency,
            prev_distance: performanceDistanceLabels[performanceDistanceLabels.length - 1]
          })
          updateLabels(performanceTimeLabels, performanceDistanceLabels, newData)
          updateData(newData, performanceData)
        } else {
          newData = await readAPI.readData({
            now,
            frequency,
            prev_distance: safetyDistanceLabels[safetyDistanceLabels.length - 1]
          })
        }
        updateLabels(safetyTimeLabels, safetyDistanceLabels, newData)
        updateData(newData, safetyData)
      }
    }, frequency)

    // Clear interval when the component is unmounted
    return () => clearInterval(graphInterval)
  }, [init, pause, terminate, runDb])

  // Reset variables upon new run, mode or session change, when the component is reloaded
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
  }, [run, mode, session, entries])

  // Plot entries from selected run
  useEffect(() => {
    // Refresh component when no entries are selected
    if (entries.length < 1) {
      setRefresh(!refresh)
      return
    }

    // Clear datasets
    performanceData.datasets = []
    safetyData.datasets = []

    // Iterate over entries to update the data
    for (let i=0; i < entries.length; i++){
      let serializedEntries = serializeEntries(entries[i].entries)
      
      // Push datasets based on selection 
      for (let j=0; j < selection.length; j++){
        performanceData.datasets.push({
          runId: entries[i].run_id,
          label: selection[j],
          data: serializedEntries[selection[j]]
        })
      }
      for (let j=0; j < safetySelection.length; j++){
        safetyData.datasets.push({
          runId: entries[i].run_id,
          label: safetySelection[j],
          data: serializedEntries[safetySelection[j]]
        })
      }
      // Update X labels (only needed once)
      if (serializedEntries.time.length > performanceTimeLabels.length){
        performanceTimeLabels = serializedEntries.time
        safetyTimeLabels = performanceTimeLabels
        performanceDistanceLabels = serializedEntries.distance
        safetyDistanceLabels = performanceDistanceLabels
      }
    }

    // Call the selection and axis update useEffect to set the labels and filter the data
    setRefresh(!refresh)
  }, [entries, selection, safetySelection])


  // FUNCTIONS
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
    timeLabels.push(newData.time)
    distanceLabels.push(newData.distance)
  }

  function serializeEntries(entries) {
    // Serialize entries, with the shape:
    // {label: [data], ...}
    let serializedEntries = {}

    // Iterate over the entries
    for (let i = 0; i < entries.length; i++) {
      // Iterate over each entry's values
      for (const [key, value] of Object.entries(entries[i])) {
        // Validate existence of key in serializedEntries
        if (key !== 'id' && key !== 'run_id') {
          if (key in serializedEntries) {
            serializedEntries[key].push(value)
          } else {
            serializedEntries[key] = [value]
          }
        }
      }
    }

    return serializedEntries
  }

function getMin(runs) {
  if (runs.length === 0) return 0

  let minRunId = 0

  for (let i=0; i < runs.length; i++) {
    // Set the minRunId as the first dataset's runId
    if (i===0) {
      minRunId = runs[i].id
    }
    // Set the minRunId if it's greater than the current dataset runId
    else if (runs[i].id < minRunId){
      minRunId = runs[i].id
    }
  }
  return minRunId
}


  // APP LAYOUT
  // Decide which control header to show
  let control = <></>
  if (mode === 'log') {
    control = (
      <div id="CONTROL" style={{ height: controlHeight + 'vh' }} className="mb-1">
        <h1 className="font-black">
          {session?.description} - {session?.type} : Intento Nro {run + 1}
        </h1>
        <div className="flex">
          <DataSelection />
          <Button
            disabled={init || session === null || !(selection.length > 0)}
            onClick={() => {
              setInit(true)
              setNow(Date.now())
            }}
          >
            Iniciar
          </Button>
          <Button disabled={!init || terminate} onClick={() => setPause(!pause)}>
            {pause ? 'Reanudar' : 'Pausar'}
          </Button>
          <Button disabled={!(init && pause)} onClick={() => setRun(run + 1)}>
            Nuevo intento
          </Button>
          <TerminateButton terminate={terminate} setTerminate={setTerminate} setMode={setMode} />
        </div>
      </div>
    )
  } else if (mode === 'read') {
    control = (
      <div id="CONTROL" style={{ height: controlHeight + 'vh' }} className="mb-1">
        <h1 className="font-black">
          {session?.description} - {session?.type}
        </h1>
        <div className="flex">
          <DataSelection />
          <ExportButton />
        </div>
      </div>
    )
  }

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
          <SessionSelection setMode={setMode} mode={mode} terminate={terminate} init={init} />
          <RunCollection mode={mode} />
        </div>

        <div
          id="MAIN"
          className="bg-[#161a1d]
                        p-6
                        flex-grow
                        min-w-0"
        >
          {control}

          <div className="flex">
            <RTCollection
              data={performanceData}
              type="performance"
              axis={Axis}
              height={mainHeight}
              frequency={frequency}
              notSafety={safetyEntries.length ? 0 : 1}
              selection={selection}
              selectedRunAmount={entries.length}
              minRunId={minRunId}
            />
            <RTCollection
              data={safetyData}
              type="safety"
              axis={Axis}
              height={mainHeight}
              frequency={frequency}
              notSafety={0}
              selection={safetySelection}
              selectedRunAmount={entries.length}
              minRunId={minRunId}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
