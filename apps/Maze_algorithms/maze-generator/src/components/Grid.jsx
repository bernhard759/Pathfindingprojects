// Grid.js
import React from "react";
import "./Grid.css";

function Grid({ maze, rows, cols }) {
  // Markup
  return (
    <div className="grid-container">
      {maze.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`grid-cell ${cell.path ? "path" : ""} 
              ${
                cell.pathDir === "up"
                  ? "up"
                  : cell.pathDir == "down"
                  ? "down"
                  : cell.pathDir === "left"
                  ? "left"
                  : cell.pathDir === "right"
                  ? "right"
                  : ""
              }
              ${cell.start ? "start" : ""} ${cell.end ? "end" : ""} 
              ${cell.passages[0] ? "passage-left" : ""}   
              ${cell.passages[1] ? "passage-top" : ""}
              ${cell.passages[2] ? "passage-right" : ""}
              ${cell.passages[3] ? "passage-bot" : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;
