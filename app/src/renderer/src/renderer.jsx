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
      label: 'Speed',
      data: [12],
    },
    {
      sessionId: 0,
      label: 'Acceleration',
      data: [80],
    }
  ]
}

// Test: pause data
let pause = false

// Test: Time data
let now = Date.now()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App data={data}/>
  </React.StrictMode>
)

// Test: Add entries to data
setInterval(() => {
  if (!pause){
    let time = Date.now() - now
    data.labels.push(Math.floor(time / 1000))
    for (let i=0; i<2; i++) {
      data.datasets[i].data.push(Math.random() * 100)
    }
  }
}, 1000)
