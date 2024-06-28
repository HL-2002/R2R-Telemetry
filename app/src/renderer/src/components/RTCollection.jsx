// Collection of plots, so that their size can be adjusted together
import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'

Chart.register(annotationPlugin)

/* Real Time Plot Collection

This component is a collection of real time plots, each with its own data and label. 
It is used to display multiple real time plots in a single div, so that their size 
can be adjusted together.

Plot amount depends on the datasets prop, their name based on the label, and their
data based on the data prop.

Each plot's data is copied into dataList, and then real-time plotting is allowed by 
updating the time state with useEffect(), which is a function that is executed after 
the first render and after every update.
*/

/* 
NOTE: Expects a list of datasets, each with a label and data, which then it'll plot
Props:
- data: {labels: [String], datasets: [{label: String, data: [Number]}]}
- type: string (performance or safety)
- axis: string (time or distance)
- height: int (vh)
- frequency: int (ms)
- notSafety: boolean (true if there are no safety plots)
*/
function RTCollection({ data, type, axis, height, frequency, notSafety }) {
  // Time state
  let [time, setTime] = useState(Date.now())

  // Create a list of data to be plotted
  let configList = []
  const n = data.datasets.length

  // Plot's titles
  let title = ''

  // Handle tire_pressure entries
  const findTirePressure = (dataset) => dataset['label'] === 'tire_pressure_fl'
  let t = data.datasets.findIndex(findTirePressure)
  let hasPressure = false

  // Collect and format tire_pressure datasets, then skip them
  if (t !== -1) {
    let dataSet = {
      labels: data.labels,
      datasets: [data.datasets[t], data.datasets[t + 1], data.datasets[t + 2], data.datasets[t + 3]]
    }

    let optionsSet = configInit(data, t, axis)
    // Setup of additional options
    optionsSet.plugins.legend = true
    optionsSet.scales.x = { display: false }

    // Set a line annotation for safety threshold
    optionsSet.plugins.annotation = {
      annotations: {
        line: {
          drawTime: 'beforeDatasetsDraw',
          type: 'line',
          borderColor: 'white',
          borderWidth: 1.5,
          borderDash: [10, 5],
          scaleID: 'y',
          value: 30
        }
      }
    }

    // Change legend labels to tire pressure
    optionsSet.plugins.legend = {
      labels: {
        // Generate labels for each dataset
        generateLabels: function (chart) {
          var data = chart.data;
          // For each dataset, generate a label following the label interface
          var legends = data.datasets.map(function(dataset, i) {
            return {
              text: formatLabel(dataset.label),
              fontColor: dataset.borderColor,
              fillStyle: (!Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]),
              hidden: !chart.isDatasetVisible(i),
              lineCap: dataset.borderCapStyle,
              lineDash: dataset.borderDash,
              lineDashOffset: dataset.borderDashOffset,
              lineJoin: dataset.borderJoinStyle,
              lineWidth: dataset.borderWidth,
              strokeStyle: dataset.borderColor,
              pointStyle: dataset.pointStyle,

              // Below is extra data used for toggling the datasets
              datasetIndex: i
            }
          }, this)
          return legends
        }
      }
    }

    configList.push({ data: dataSet, options: optionsSet })

    t += 4
    hasPressure = true
  } else {
    t = 0
  }

  // Set data for each plot
  for (let i = t; i < n; i++) {
    // Set data for each plot
    let dataSet = {
      labels: data.labels,
      datasets: [data.datasets[i]]
    }

    // Set options for each plot
    let optionsSet = configInit(data, i, axis)

    // Add 0 degrees line for steering_angle
    if (data.datasets[i].label === 'steering_angle') {
      optionsSet.plugins.annotation = {
        annotations: {
          line: {
            drawTime: 'beforeDatasetsDraw',
            type: 'line',
            borderColor: 'white',
            borderWidth: 1.5,
            borderDash: [1, 0],
            scaleID: 'y',
            value: 0
          }
        }
      }
    }

    // Disable x-axis for all but the last plot
    if (i !== n - 1) {
      optionsSet.scales.x = { display: false }
    }

    // Push data and options to configList
    configList.push({ data: dataSet, options: optionsSet })
  }

  // Format each plot's line style
  configList.forEach((config) => {
    config.data.datasets.forEach((dataset) => {
      if (!dataset.label.includes('tire')) {
        dataset.borderColor = '#ec6d2d'
      }
      dataset.borderWidth = 1.5
      dataset.pointRadius = 0
    })
  })

  // Set collection title
  if (type === 'performance') {
    title = 'Rendimiento'
  } else if (type === 'safety') {
    title = 'Salud'
  }

  // Set update interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
    }, frequency)

    return () => clearInterval(interval)
  })


  // Map data to plots within a div
  // All is contained within a single div, so that their width can be adjusted together.
  // However, their height is adjusted individually based on the height of each plot's div.

  // If there are plots to display, return the collection
  // Otherwise, return an empty div
  if (n > 0) {
    return (
      <div
        id="RTCollection"
        key="RTCollection"
        // Width is adjusted based the existence of safety plots
        style={{ width: 50 + 50 * notSafety + '%', height: height + 'vh' }}
        className='pr-4'
      >
        <h1 className='font-bold'>{title}</h1>
        {configList.map((config) => (
          // Height is divided by the number of plots, minus the space taken by the title
          <div
            key={config.data.datasets[0].label}
            style={{ height: (height - 2) / (n - 3 * hasPressure) + 'vh' }}
          >
            <Line data={config.data} options={config.options} />
          </div>
        ))}
      </div>
    )
  } else {
    return <div style={{ width: 50 + 50 * notSafety + '%', height: height + 'vh' }}></div>
  }
}

function formatTitle(title) {
  title = title.replace('_fl', '')
  return title.replace('_', ' ').toUpperCase()
}

function formatLabel(label) {
  return label.replace('tire_pressure_', '').toUpperCase()
}

function configInit(data, index, axis) {
  return {
    // Performance options
    normalized: true,
    scales: {
      y: configScale(data.datasets[index].label),
      x: configAxis(axis)
    },
    elements: {
      point: {
        radius: 0
      }
    },
    spanGaps: true,
    animation: false,
    // Aesthetic options
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: false,
      title: {
        display: true,
        text: formatTitle(data.datasets[index].label),
        align: 'start'
      }
    }
  }
}

function configScale(label) {
  let y = {
    type: 'linear',
    min: 0,
    max: 0,
    ticks: {
      stepSize: 0
    },
    afterTickToLabelConversion: (ctx) => {}
  }
  /*
    NOTE: To be able to disable the x-axis display for bigger plots, the y axis of all
    plots must be aligned. This means that each plot's labels must be of the same length.

    As most labels have a length of 4 (3 digits and a blank), the afterTickToLabelConversion 
    callback function is used to add a blank space to the left of the labels with less than 4
    characters, so that all labels have the same length.

    These labels are the rpms, gear, lateral_g, and tire_pressure_fl.
    */
  switch (label) {
    case 'velocity':
      y.max = 250
      y.ticks.stepSize = 50
      return y

    case 'rpms':
      y.max = 8000
      y.ticks.stepSize = 1000
      y.afterTickToLabelConversion = (ctx) => {
        ctx.ticks.forEach((tick) => {
          tick.label = '   ' + tick.value / 1000 + 'k'
        })
      }
      return y

    case 'gear':
      y.max = 6
      y.ticks.stepSize = 1
      y.afterTickToLabelConversion = (ctx) => {
        ctx.ticks.forEach((tick) => {
          tick.label = '    ' + tick.value
        })
      }
      return y

    case 'lateral_g':
      y.max = 3
      y.ticks.stepSize = 1
      y.afterTickToLabelConversion = (ctx) => {
        ctx.ticks.forEach((tick) => {
          tick.label = '    ' + tick.value
        })
      }
      return y

    case 'steering_angle':
      y.max = 270
      y.min = -270
      y.ticks.stepSize = 90
      return y

    case 'tire_pressure_fl':
      y.max = 50
      y.ticks.stepSize = 15
      y.afterTickToLabelConversion = (ctx) => {
        ctx.ticks.forEach((tick) => {
          tick.label = '  ' + tick.value
        })
      }
      return y

    // TODO: Define min and maxvalues for these two
    case 'temperature':
      y.max = 100
      y.ticks.stepSize = 25
      return y

    case 'oil_pressure':
      y.max = 100
      y.ticks.stepSize = 25
      return y

    case 'throttle':
    case 'brake':
    case 'fuel':
      y.max = 100
      y.ticks.stepSize = 25
      return y
  }
}

function configAxis(axis) {
  let x = {
    ticks: {},
    title: {
      display:true,
    }
  }

  if (axis === 'time') {
    x.ticks = {
      callback: function (value, index, ticks) {
        return this.getLabelForValue(value)
      }
    }
    x.title.text = "Tiempo (s)"
  } else if (axis === 'distance') {
    x.ticks = {
      callback: function (value, index, ticks) {
        return (this.getLabelForValue(value)/1e3).toFixed(2)
      }
    }
    x.title.text = "Distancia (km)"
  }

  return x
}

export default RTCollection
