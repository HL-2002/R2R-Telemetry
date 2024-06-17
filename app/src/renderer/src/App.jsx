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
    <Line data={props.data}/>
    <RTCollection data={props.data} frequency={props.frequency}/>
    <Versions />
    </>
  )
}

export default App
