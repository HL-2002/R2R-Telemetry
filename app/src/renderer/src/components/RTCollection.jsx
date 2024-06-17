// Collection of plots, so that their size can be adjusted together
import { useState, useEffect } from 'react'
import {Line} from 'react-chartjs-2'

// Real Time Plot Collection
// Expects a list of datasets, each with a label and data, which then it'll plot
// Props:
// - data: {labels: [String], datasets: [{label: String, data: [Number]}]}
// - init: bool
// - pause: bool
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