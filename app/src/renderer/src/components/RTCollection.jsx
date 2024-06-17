// Collection of plots, so that their size can be adjusted together
import { useState, useEffect } from 'react'
import {Line} from 'react-chartjs-2'

/* Real Time Plot Collection

This component is a collection of real time plots, each with its own data and label. 
It is used to display multiple real time plots in a single div, so that their size 
can be adjusted together.

Plot amount depends on the datasets prop, their name based on the label, and their
data based on the data prop.

Data is set for each plot, and then real-time plotting is allowed by updating the time
state with useEffect(), which is a function that is executed after the first render and 
after every update.
*/


// Expects a list of datasets, each with a label and data, which then it'll plot
// Props:
// - data: {labels: [String], datasets: [{label: String, data: [Number]}]}
// - init: bool
// - pause: bool
// - type: string (performance or safety)
function RTCollection(props) {
    // Time state
    let [time, setTime] = useState(Date.now())

    // Create a list of data to be plotted
    let dataList = []
    const n = props.data.datasets.length

    // Set data for each plot
    for (let i=0; i<n; i++) {
        // Push data for each plot
        dataList.push({
            labels: props.data.labels,
            datasets: [props.data.datasets[i]]
        })
    }

    // Set update interval
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(Date.now());
        }, props.frequency);
        return () => clearInterval(interval);
    }, [props.frequency]);

    // Map data to plots within a div
    return <div id="RTCollection" key="RTCollection">
        {dataList.map((data) => <Line key={data.datasets[0].label} data={data}> </Line>)}
    </div>
}

export default RTCollection