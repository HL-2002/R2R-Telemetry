import Chart from 'chart.js/auto'

function Plot(props) {
  let canvas = <canvas id={props.id} width={props.width} height={props.height}></canvas>

  let labels = [1]
  let data = {
    labels: labels,
    datasets: [
      {
        label: 'Speed',
        data: [12]
      }
    ]
  }
  let config = {
    type: 'line',
    data: data,
    options: {}
  }

  let chart = new Chart(canvas, config)

  return canvas
}

export default Plot
