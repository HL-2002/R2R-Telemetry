import Versions from './components/Versions.jsx'
import { Line } from 'react-chartjs-2'
import { useState } from 'react'

// TODO: Need to import necessary modules for Chart.js only
import Chart from 'chart.js/auto'

// Test: Importing and using collection
import RTCollection from './components/RTCollection.jsx'
import SessionSelection from './components/SessionSelection.jsx'

// Size variables (vh and vw)
let sectionWidth = 30
let mainWidth = 100 - sectionWidth
let controlHeight = 15
let mainHeight = 100 - controlHeight

function App() {
  return (
    <>
    <SessionSelection />
    <div className='flex flex-row border-8' style={{width:mainWidth + 'vw'}}>
      <RTCollection data={performanceData} options={chartOptions} height={mainHeight} frequency={frequency}/>
      <RTCollection data={safetyData} options={chartOptions} height={mainHeight} frequency={frequency}/>
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
  'oil_pressure']

let performanceSelection = [
  'velocity', 
  'rpms', 
  'gear', 
  'lateral_g', 
  'throttle', 
  'brake', 
  'steering_angle']

function dataInit(dataSelection) {
  let data = {
    labels: [],
    datasets: []
  }

  let n = dataSelection.length

  for (let i=0; i<n; i++) {
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

// Config init
let chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

// Test: pause data update
let pause = false

// Test: Time data
let now = Date.now()

// Test: frequency of data update
let frequency = 500

// Test: Add entries to data
setInterval(() => {
  if (!pause){
    updateData(safetyData)
    updateData(performanceData)
  }
}, frequency)

async function updateData(data) {
  let newData = await readAPI.readData()
  let n = data.datasets.length
  let time = Date.now() - now
  data.labels.push(Math.floor(time / 1000))
  for (let i=0; i<n; i++) {
    if (data.datasets[i].label === 'tire_pressure_fl') {
      data.datasets[i].data.push(newData['tire_pressure_fl'])
      data.datasets[i+1].data.push(newData['tire_pressure_fr'])
      data.datasets[i+2].data.push(newData['tire_pressure_rl'])
      data.datasets[i+3].data.push(newData['tire_pressure_rr'])
      i += 3
    } else {
      data.datasets[i].data.push(newData[data.datasets[i].label])
    }
  }
  console.log(data.datasets)
}

export default App
