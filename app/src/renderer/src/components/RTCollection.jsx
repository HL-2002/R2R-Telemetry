// Collection of plots, so that their size can be adjusted together
import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { useSessionStore } from '../context/SessionContext'
// TODO: Need to import necessary modules for Chart.js only
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
- selection: [String] (list of selected datasets)
- selectedRunAmount: int (amount of selected runs)
- minRunId: int (minimum run id)
*/
/* 
TODO: needs optimization, component is re-rendered many times (5, to be exact) 
each time a new run is selected, instead of a single time. Can log into console with 
console.log(configList) before returning the html code.
*/
function RTCollection({ data, type, axis, height, frequency, notSafety, selection, selectedRunAmount, minRunId }) {
  // Session state
  const session = useSessionStore((state) => state.session)
  // Time state
  let [time, setTime] = useState(Date.now())

  // Create a list of data to be plotted
  let configList = []
  const n = selection.length

  // Plot's titles
  let title = ''

  // Plot's colors (based on max amount of selected runs)
  const borderColors = ['RGBA(236, 109, 45, 1)', 'RGBA(55, 162, 235, 1)', 'RGBA(255, 205, 86, 1)', 'RGBA(255, 75, 110, 1)']
  const backgroundColors = ['RGBA(236, 109, 45, 0.41)', 'RGBA(55, 162, 235, 0.41)', 'RGBA(255, 205, 86, 0.41)', 'RGBA(255, 75, 110, 0.41)']
  
  // Run legend
  const legend = {
    labels: {
      // Generate labels for each dataset
      generateLabels: function (chart) {
        var data = chart.data;
        // For each dataset, generate a label following the label interface
        var legends = data.datasets.map(function(dataset, i) {
          return {
            // Label is set to the run number whenever run
            text: `Intento ${dataset.runId + (1 - minRunId) * Number(dataset.runId > 0)}`,
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
          }
        }, this)
        return legends
      }
    },
    // Disable data toggling
    onClick: (e) => null
  }

  // Handle tire_pressure entries  
  let pressureSelection = selection.filter((label) => label.includes('tire_pressure'))
  // Set term to adjust height based on tire_pressure entries
  let pressureTerm = pressureSelection.length > 0 ? pressureSelection.length - 1 : 0
  // Collect and format tire_pressure datasets
  if (pressureSelection.length > 0) {
    // Data initialization
    let plotData = {
      labels: data.labels,
      datasets: []
    }
    let optionsSet = configInit('tire_pressure', axis)

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

    // Setup of additional options
    optionsSet.plugins.legend = true
    optionsSet.scales.x = { display: false }

    // Filter data
    let tirePressureData = data.datasets.filter((dataset) => pressureSelection.includes(dataset.label))

    // Set tire pressure data based on run amount
    if (selectedRunAmount <= 1) {
      plotData.datasets = tirePressureData

      // Change legend labels to tire pressure fl, fr, rl, rr
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
    }
    // If there's more than one run selected
    else {
      // Average datasets into one
      let k = pressureSelection.length
      let sum = 0
      // Iterate over each dataset per run
      for (let i = 0; i < tirePressureData.length/k; i++) {
        let dataset = {
          runId: tirePressureData[i*k].runId,
          label: `tire_pressure ${i+1}`,
          data: []
        }
        
        // Get pressure sets for each run
        let pressureSet = tirePressureData.slice(i*k, i*k + k)

        // Iterate over each set's data
        for (let j=0; j < data.labels.length; j++) {
          sum = 0
          // Average the data across the set's runs
          /* 
          NOTE: limit is pressureSet.length instead of k, as k never changes per iteration,
          but the length of the sets do, as each change in the selection makes App to serialize
          each run's entries and update the data one by one, resulting in a pressureSet that changes
          at the first iterations of the serialization.

          This is undesirable behavior to say the least, and its why it's crucial to extract all 
          data processing and formatting this plot does into its own module for App.jsx to use, so that
          the plot receives the data as is and only plots based on the configs given.
          */ 
          for (let l=0; l < pressureSet.length; l++) {
            sum += pressureSet[l].data[j]
          }
          dataset.data.push(sum / k)
        }

        // Push to plotData
        plotData.datasets.push(dataset)
      }

      // Change legend labels to the run number
      optionsSet.plugins.legend = legend
      
    }
    
    // Push data and options to configList
    /* 
      NOTE: Needs validation for empty data, because even though the plotData is initialized,
      it's possible that the data is empty, which will result in a plot with no data, and a
      console error.
      
      This is quite a curious behavior, as the data is actually coming from App.jsx correctly,
      but for some reason, amidst the rendering of this component, the data is lost or not updated
      somehow, again highlighting the importance of separating the data processing and formatting
      from the plotting itself.
    */
    if (tirePressureData.length > 0) configList.push({ data: plotData, options: optionsSet })
    
  }

  // Set data for each plot, iterating over the selection
  for (let i = 0; i < n; i++) {
      // Skip tire_pressure entries
      if (selection[i].includes('tire_pressure')) continue

      // Set data for each plot
      let plotData = {
        labels: data.labels,
        datasets: data.datasets.filter((dataset) => dataset.label === selection[i])
      }

      // Set options for each plot and push config if the dataset is not empty
      /* 
        NOTE: Needs same validation as tire_pressure entries, as the data is lost or not updated,
        so it's yet another reason to separate the data processing and formatting from the plotting.
      */
      if (plotData.datasets.length > 0) {
        let optionsSet = configInit(plotData.datasets[0].label, axis)

        // Add legend to 1st safety plot if there's no tire_pressure in selection
        if (selection.includes('fuel') && selectedRunAmount > 0 && pressureSelection.length < 1 && i === 0) {
          optionsSet.plugins.legend = legend
        }

        // Add 0 degrees line for steering_angle
        if (data.datasets[i].label === 'steering_angle') {
          optionsSet.plugins.annotation = {
            annotations: {
              line: {
                drawTime: 'beforeDatasetsDraw',
                type: 'line',
                borderColor: 'white',
                borderWidth: 0.5,
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
        configList.push({ data: plotData, options: optionsSet })
      }
      
  }

  // Format each plot's line style
  configList.forEach((config) => {
    config.data.datasets.forEach((dataset, i) => {
      dataset.borderColor = borderColors[i]
      dataset.backgroundColor = backgroundColors[i]
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
    let interval = undefined
    // Set interval only if there are no selected runs
    if (session != null && selectedRunAmount === 0) {
      interval = setInterval(() => {
        setTime(Date.now())
      }, frequency)
    }
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
        style={{ 'minWidth': 50 + 50 * notSafety + '%', height: height + 'vh' }}
        className='pr-4'
      >
        <h1 className='font-bold'>{title}</h1>
        {configList.map((config) => (
          // Height is divided by the number of plots, minus the space taken by the title
          <div
            key= {config.data.datasets[0].label}
            style={{ height: (height - 2) / (n - pressureTerm) + 'vh' }}
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

function configInit(label, axis) {
  return {
    // Performance options
    normalized: true,
    scales: {
      y: configScale(label),
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
        text: formatTitle(label),
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

    It also does this for stering_angle, as it has a length of 5 (3 digits, blank and a sign),
    eliminating the sign for the negative values.
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
      y.afterTickToLabelConversion = (ctx) => {
        ctx.ticks.forEach((tick) => {
          tick.label = String(tick.value).replace('-', '')
        })
      }
      return y

    case 'tire_pressure':
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
        return Math.floor(this.getLabelForValue(value))
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
