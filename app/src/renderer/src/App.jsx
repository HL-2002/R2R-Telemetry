import Versions from './components/Versions.jsx'
// Test: Importing and using plot for testing purposes
import {Line} from 'react-chartjs-2'
import Chart from 'chart.js/auto'

// Test: Importing and using collection
import RTCollection from './components/RTCollection.jsx'

function App(props) {
  return (
    <>
    <h1>electron app</h1>
    <Line data={props.data}/>
    <RTCollection data={props.data}/>
    <Versions />
    </>
  )
}

export default App
