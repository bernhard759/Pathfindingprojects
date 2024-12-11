export default function solveMaze(maze) {
  const rows = maze.length;
  const cols = maze[0].length;

  // Define directions for moving in the maze
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];

  // Initialize visited array
  const visited = [];
  for (let i = 0; i < rows; i++) {
    visited[i] = [];
    for (let j = 0; j < cols; j++) {
      visited[i][j] = false;
    }
  }

  const path = []; // Store the path from start to end

  function dfs(row, col) {
    // Base case: If we reached the end of the maze, return true
    if (row === rows - 1 && col === cols - 1) {
      return true;
    }

    // Mark the current cell as visited
    visited[row][col] = true;

    // Explore each direction
    for (let { row: dr, col: dc } of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the new cell is within bounds and not a wall and not visited
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        maze[newRow][newCol].passages[
          dr != 0 ? (dr === 1 ? 1 : 3) : dc === 1 ? 0 : 2
        ] &&
        !visited[newRow][newCol]
      ) {
        // Recursively explore the new cell
        if (dfs(newRow, newCol)) {
          path.push({ row, col }); // Add the current cell to the path
          maze[row][col].path = true;
          if (dr === 1) maze[row][col].pathDir = "down";
          if (dr === -1) maze[row][col].pathDir = "up";
          if (dc === 1) maze[row][col].pathDir = "right";
          if (dc === -1) maze[row][col].pathDir = "left";
          return true;
        }
      }
    }

    // If no valid path found from this cell, backtrack
    return false;
  }

  // Start DFS from the top-left corner (start of the maze)
  dfs(0, 0);

  // Return the maze
  return maze;
}
