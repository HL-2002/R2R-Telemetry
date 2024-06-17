import Versions from './components/Versions.jsx'
import {Line} from 'react-chartjs-2'
import { useState } from 'react'

// TODO: Need to import necessary modules for Chart.js only
import Chart from 'chart.js/auto'

// Test: Importing and using collection
import RTCollection from './components/RTCollection.jsx'

function App(props) {
  return (
    <>
    <h1>electron app</h1>
    <Line data={safetyData}/>
    <RTCollection data={safetyData} frequency={frequency}/>
    <Versions />
    </>
  )
}

// Methods
// Test: Data creation and handling

// Test: Data selection
// WARNING: safetySelection gotta have tire_pressure entries together, so that the data 
// init and append algorithms works
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
  'throttle', 
  'brake', 
  'lateral_g', 
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

// Test: pause data
let pause = false

// Test: Time data
let now = Date.now()

// Test: frequency of data update
let frequency = 500

// Test: Add entries to data
setInterval(async () => {
  if (!pause){
    let n = safetyData.datasets.length
    let time = Date.now() - now
    let newData = await readAPI.readData()
    safetyData.labels.push(Math.floor(time / 1000))
    for (let i=0; i<n; i++) {
      if (safetyData.datasets[i].label === 'tire_pressure_fl') {
        safetyData.datasets[i].data.push(newData['tire_pressure_fl'])
        safetyData.datasets[i+1].data.push(newData['tire_pressure_fr'])
        safetyData.datasets[i+2].data.push(newData['tire_pressure_rl'])
        safetyData.datasets[i+3].data.push(newData['tire_pressure_rr'])
        i += 3
      } else {
        safetyData.datasets[i].data.push(newData[safetyData.datasets[i].label])
      }
    }
  }
}, frequency)

export default App
