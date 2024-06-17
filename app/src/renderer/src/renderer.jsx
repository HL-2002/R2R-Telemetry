import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Test: Data creation and handling
let data = {
  labels: [0],
  datasets: [
    {
      sessionId: 0,
      label: 'speed',
      data: [12]
    },
    {
      sessionId: 0,
      label: 'acceleration',
      data: [80]
    }
  ]
}

// Test: pause data
let pause = false

// Test: Time data
let now = Date.now()

// Test: frequency of data update
let frequency = 500

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App data={data} frequency={frequency} />
  </React.StrictMode>
)

// Test: Add entries to data
setInterval(async () => {
  if (!pause) {
    let n = data.datasets.length
    let time = Date.now() - now
    let newData = await readAPI.readData()
    data.labels.push(Math.floor(time / 1000))
    for (let i = 0; i < n; i++) {
      data.datasets[i].data.push(newData[data.datasets[i].label])
    }
  }
}, frequency)
