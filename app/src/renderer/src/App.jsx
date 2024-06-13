<<<<<<< Updated upstream
import Button from './components/Button'

=======
import chart  from "chart.js/auto"
>>>>>>> Stashed changes
function App() {
  console.log(chart)
  return (
    <>
      <Button
        name={'iniciar sistema'}
        click={() => {
          // open video youtube joke
          window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        }}
      />
      <Button type="error" name={'borrar todo'} />
    </>
  )
}

export default App
