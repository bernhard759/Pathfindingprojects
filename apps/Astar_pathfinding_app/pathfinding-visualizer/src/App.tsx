import './App.css'
import Grid from "./components/Grid.tsx"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <h1>A* search algorithm visualizer</h1>
      <div>
        <p>Select an option for the mode and click on the grid cells to mark them as start node, end node, obstacle or clear the node. You can press the Play button to start the A* algorithm.</p>
      </div>
      <Grid />
    </>
  )
}

export default App
