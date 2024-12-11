import { useCallback, useEffect, useState } from "react";
import GraphGrid from "../data_structure/Grid";
import "./Grid.css";
import aStar from "../algorithm/astar";
import { produce } from "immer";
import { setAutoFreeze } from "immer";
import _ from "lodash";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


// Immer autofreeze option for typescript
setAutoFreeze(false);

/**
  * Enum for the different modes
  */
enum Mode {
  start = 1,
  end,
  obstacle,
  empty,
}


function Grid() {

  // Grid setup
  const rows = 25;
  const cols = 35;
  const theGrid = new GraphGrid(rows, cols);
  const startNode = theGrid.getNode(0, 0);
  const endNode = theGrid.getNode(15, 20);
  startNode.makeStart();
  endNode.makeEnd();
  theGrid.getNode(10, 9).makeObstacle();
  theGrid.getNode(10, 10).makeObstacle();
  theGrid.getNode(10, 11).makeObstacle();
  theGrid.getNode(10, 12).makeObstacle();
  startNode.removeParent();
  endNode.setParent(startNode);
  endNode.removeParent();
  endNode.removeParent();


  // Grid state
  const [grid, setGrid] = useState<GraphGrid>(theGrid);

  // Interation mode state
  const [mode, setMode] = useState(Mode.start);

  const [isVizRunning, setVizRunning] = useState(false);

  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);


  /**
   * Start the search algorithm visualization
   */
  async function startViz() {
    setVizRunning(prev => true);
    // Clear the path
    setGrid((prev) => produce(prev, draftGrid => {
      draftGrid.reset();
    })
    );

    // Run the A* algorithm to get the shortest path
    const path = await aStar(_.cloneDeep(grid), (gridObj: GraphGrid) => setGrid(() => gridObj), () => forceUpdate());

    // Update grid state
    setGrid((prev) => produce(prev, draftGrid => {
      draftGrid.getAllNodes().forEach(node => {
        if (path?.find((element) => element.id === node.id)) {
          node.isOnPath = true;
        }
      });
    }));
    setVizRunning(false);
  };


  /**
   * Reset the visualization
   */
  function resetViz() {
    // Clear the path
    setGrid((prev) => produce(prev, draftGrid => {
      draftGrid.reset(true);
    })
    );
  };


  /**
   * Handle the click on a node to color it
   * @param row 
   * @param col 
   */
  function handleNodeClick(row: number, col: number) {

    // Update grid state
    setGrid(produce(draftGrid => {
      // Get the node
      const node = draftGrid.getNode(row, col);

      // change attributes based on mode
      switch (mode) {
        case Mode.start:
          draftGrid.getAllNodes().forEach(node => {
            node.isStart ? node.isStart = false : undefined;
          });
          node.makeStart();
          break;
        case Mode.end:
          draftGrid.getAllNodes().forEach(node => {
            node.isEnd ? node.isEnd = false : undefined;
          });
          node.makeEnd();
          break;
        case Mode.obstacle:
          node.makeObstacle();
          break;
        case Mode.empty:
          if (node.isStart || node.isEnd) return;
          node.empty();
          break;
        default:
          break;
      }
    }));
  }

  // Markup
  return (
    <>
      <div className="m-2 d-flex gap-2 justify-content-center">
        <Button onClick={startViz} disabled={isVizRunning}>Play</Button>
        <Button onClick={resetViz} disabled={isVizRunning}>Reset</Button>
      </div>
      <div className="m-3 d-flex gap-5 justify-content-center">
        <div>
          <Form.Check
            inline
            type="radio"
            id="start"
            name="nodeType"
            value="start"
            checked={mode === Mode.start}
            onChange={() => setMode(Mode.start)}
          />
          <label htmlFor="start">Start</label>
        </div>
        <div>
          <Form.Check
            inline
            type="radio"
            id="end"
            name="nodeType"
            value="end"
            checked={mode === Mode.end}
            onChange={() => setMode(Mode.end)}
          />
          <label htmlFor="end">End</label>
        </div>
        <div>
          <Form.Check
            inline
            type="radio"
            id="obstacle"
            name="nodeType"
            value="obstacle"
            checked={mode === Mode.obstacle}
            onChange={() => setMode(Mode.obstacle)}
          />
          <label htmlFor="obstacle">Obstacle</label>
        </div>
        <div>
          <Form.Check
            inline
            type="radio"
            id="empty"
            name="nodeType"
            value="empty"
            checked={mode === Mode.empty}
            onChange={() => setMode(Mode.empty)}
          />
          <label htmlFor="empty">Empty</label>
        </div>
      </div>
      <div className="grid">
        {grid.nodes.map((row, rowIndex) => (
          <div key={rowIndex} className="noderow">
            {row.map((node) => (
              <div
                key={`${node.row}-${node.col}`}
                className={`node ${node.isObstacle ? "obstacle" : node.isStart ? "start" : node.isEnd ? "end" : ""} ${node.isOnPath ? "path" : ""} ${node.known ? "known" : ""} ${node.searched ? "searched" : ""}`}
                onClick={() => handleNodeClick(node.row, node.col)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Grid;