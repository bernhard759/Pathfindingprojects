/**
 * Generate a maze with recursive backtracking DFS
 * @param {*} rows
 * @param {*} cols
 * @returns
 */
export default function generateMaze(rows, cols) {
  // Starter maze
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
      };
    }
  }
  maze[0][0].start = true;
  maze[rows-1][cols-1].end = true;
  console.log(maze);

  function recursiveBacktrackingMaze(row, col) {
    // Mark the current cell as visited
    console.log("marking false");
    maze[row][col].cell = false;
    console.log("at ", row, col);
    console.log("maze", maze);
    // Directions
    const directions = [
      { dr: -1, dc: 0 }, // Up
      { dr: +1, dc: 0 }, // Down
      { dr: 0, dc: -1 }, // Left
      { dr: 0, dc: +1 }, // Right
    ];

    // Randomize the order of directions
    directions.sort(() => Math.random() - 0.5);

    console.log("directions", directions);

    // Bounds check
    for (let { dr, dc } of directions) {
      if (
        row + dr >= 0 &&
        row + dr < rows &&
        col + dc >= 0 &&
        col + dc < cols &&
        maze[row + dr][col + dc].cell
      ) {
        // Passage
        console.log("from ", row, col, " to ", row + dr, col + dc);
        maze[row][col].passages[
          dr != 0 ? (dr == 1 ? 3 : 1) : dc == 1 ? 2 : 0
        ] = true;
        maze[row + dr][col + dc].passages[
          dr != 0 ? (dr == 1 ? 1 : 3) : dc == 1 ? 0 : 2
        ] = true;

        // Recursively visit the next cell
        recursiveBacktrackingMaze(row + dr, col + dc);
      }
    }
  }

  // Start with the top left cell
  recursiveBacktrackingMaze(0, 0);
  //console.log(maze)
  return maze;
}
