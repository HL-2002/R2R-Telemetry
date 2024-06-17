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
    <Line data={data}/>
    <RTCollection data={data} frequency={frequency}/>
    <Versions />
    </>
  )
}

// Methods
// Test: Data creation and handling
let data = {
  labels: [0],
  datasets: [
    {
      sessionId: 0,
      label: 'speed',
      data: [12],
    },
    {
      sessionId: 0,
      label: 'acceleration',
      data: [80],
    }
  ]
}

// Test: Data selection
let safetySelection = ['tire_pressure', 'fuel', 'temperature', 'oil_pressure']
let performanceSelection = [velocity, rpms, gear, acceleration, brake, lateral_g,steering_angle]

// Test: pause data
let pause = false

// Test: Time data
let now = Date.now()

// Test: frequency of data update
let frequency = 500

// Test: Add entries to data
setInterval(async () => {
  if (!pause){
    let n = data.datasets.length
    let time = Date.now() - now
    let newData = await readAPI.readData()
    data.labels.push(Math.floor(time / 1000))
    for (let i=0; i<n; i++) {
      data.datasets[i].data.push(newData[data.datasets[i].label])
    }
  }
}, frequency)

export default App
