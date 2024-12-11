import { useEffect, useState } from "react";
import generateMaze from "./algorithms/mazeGenerator";
import solveMaze from "./algorithms/mazeSolver";
import Grid from "./components/Grid";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import _ from "lodash";

import "./App.css";

function App() {
  // Maze dimensions
  const [rows, setRows] = useState(15);
  const cols = rows;

  // Starter maze
  const starterMaze = generateStarterMaze(rows, cols);

  /**
   * Generate a starting maze with given dimensions
   * @param {*} rows
   * @param {*} cols
   * @returns
   */
  function generateStarterMaze(rows, cols) {
    const maze = [];
    for (let i = 0; i < rows; i++) {
      maze[i] = [];
      for (let j = 0; j < cols; j++) {
        maze[i][j] = {
          cell: true,
          path: false,
          start: false,
          end: false,
          passages: [false, false, false, false],
          pathDir: "",
        };
      }
    }
    return maze;
  }

  // Maze state
  const [maze, setMaze] = useState(starterMaze);
  const [generated, setGenerated] = useState(false);

  // Maze dimension update
  useEffect(() => {
    setMaze(generateStarterMaze(rows, cols));
    setGenerated(false);
  }, [rows]);

  /**
   * Generate a new maze
   */
  function handleGenerateMaze() {
    const newMaze = generateMaze(rows, cols);
    setMaze(newMaze);
    setGenerated(true);
  }

  /**
   * Generate a new maze
   */
  async function handleSolveMaze() {
    const solvedMaze = solveMaze(_.cloneDeep(maze));
    console.log("SOLVED", solvedMaze);
    setMaze(solvedMaze);
  }

  // Markup
  return (
    <div className="App">
      <h1>Maze Generator</h1>
      {/* Controls */}
      <div className="m-2 mt-4 d-flex gap-2 mb-3">
        <Button variant="outline-dark" onClick={() => handleGenerateMaze()}>
          Generate Maze with DFS
        </Button>
        <Button variant="outline-dark" onClick={() => handleSolveMaze()} disabled={!generated}>
          Solve Maze
        </Button>
        <div className="m-2 d-flex flex-column  justify-content-center align-items-center gap-2">
          <Form.Label>Maze size</Form.Label>
          <Form.Range
            value={rows}
            onChange={(e) => setRows(e.target.value)}
            min="5"
            max="50"
          />
        </div>
      </div>
      {/* Maze grid component */}
      <Grid maze={maze} rows={rows} cols={cols} />
    </div>
  );
}

export default App;
