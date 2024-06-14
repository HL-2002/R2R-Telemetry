// Collection of plots, so that their size can be adjusted together
import {Line} from 'react-chartjs-2'


// Real Time Plot Collection
// Expects a list of datasets, each with a label and data
function RTCollection(props) {
    // Create a list of data to be plotted
    let dataList = []

    // Clear data for each plot
    for (let i=0; i<2; i++) {
        // Push data for each plot
        dataList.push({
            labels: props.data.labels,
            datasets: [props.data.datasets[i]]
        })
    }

    // Map data to plots within a div
    return <div id="RTCollection" key="RTCollection">
        {dataList.map((data) => <Line key={data.datasets[0].label} data={data}> </Line>)}
    </div>
}

export default RTCollection