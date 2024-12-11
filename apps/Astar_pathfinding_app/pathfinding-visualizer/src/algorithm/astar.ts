import GraphGrid from "../data_structure/Grid";
import GraphNode from "../data_structure/Node";

/**
 * Get the neighbour nodes of a given node in the grid
 * @param node 
 * @param grid 
 * @returns 
 */
function getNeighbourNodes(node: GraphNode, grid: GraphGrid) {
    const neighbours = [];
    const numRows = grid.rows;
    const numCols = grid.cols;

    // Define the relative positions of the neighboring nodes
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
    ];

    // Check each direction to find valid neighboring nodes
    for (const dir of directions) {
        //console.error(node.col, node.row)
        const newRow = node.row + dir.row;
        const newCol = node.col + dir.col;

        /*if (newRow === 0) {
            console.warn("new ", newRow, newCol, " node", node.row, node.col)
        }*/

        // Check if the new coordinates are within the grid bounds
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            neighbours.push(grid.getNode(newRow, newCol));
        }
    }

    return neighbours;
}

/**
 * Calculate the distance between two nodes => h value
 * @param node 
 * @param endNode 
 * @returns 
 */
function calculateHeuristic(node: GraphNode, endNode: GraphNode) {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}

/**
 * Calculate the cost for for moving from the node to a neighbour => g value
 * @param node 
 * @param neighbor 
 * @returns 
 */
function calculateCost(node: GraphNode, neighbor: GraphNode) {
    return 1;
}


function reconstructPath(endNode: GraphNode) {
    const path = [];
    let currentNode = endNode;

    // Traverse back through the parent nodes until we reach the start node
    while (currentNode !== null) {
        path.push(currentNode);
        currentNode = currentNode.parent!;
    }

    // Reverse the path array to get the correct order from start to end
    return path.reverse();
}


/**
 * A* Search algorithm implementation
 * @param grid 
 * @param startNode 
 * @param endNode 
 * @returns 
 */
export default async function aStar(grid: GraphGrid, gridSetterFunc: Function, updater: Function) {

    // Get start and end node
    let startNode = grid.getAllNodes().find(node => node.isStart === true)!;
    let endNode = grid.getAllNodes().find(node => node.isEnd === true)!;

    // Init start node
    startNode.g = 0;
    startNode.f = startNode.g + calculateHeuristic(startNode, endNode);

    // Open and closed lists
    let openList = [startNode];
    let closedList: GraphNode[] = [];

    while (openList.length > 0) {

        // Find the node with the lowest f value in the open list
        const currentNode = openList.reduce((min, obj) => obj.f < min.f ? obj : min);
        console.log(openList, "current node", currentNode);
        if (currentNode.row === 0) {
            console.warn(currentNode)
        }

        // If the current node is the end node, reconstruct and return the path
        if (currentNode === endNode) {
            return reconstructPath(endNode);
        }

        // Move the current node from the open list to the closed list
        openList = openList.filter(obj => obj.id !== currentNode.id);
        closedList.push(currentNode);
        currentNode.searched = true;
        console.log("searched")
        console.log("open", openList, "closed", closedList)


        const neighbors = getNeighbourNodes(currentNode, grid);
        for (const neighbor of neighbors) {

            // Skip neighbors that are obstacles or are in the closed list
            if (neighbor.isObstacle === true || closedList.find(node => node.id === neighbor.id)) {
                continue;
            }

            // Calculate the g value
            const tentativeG = currentNode.g + calculateCost(currentNode, neighbor);

            // Dont do anything if the neighbor is already open and the new way has higher cost
            if (openList.find(node => node.id === neighbor.id) && tentativeG >= neighbor.g) {
                continue;
            }

            // Set parent
            neighbor.setParent(currentNode);

            // Update weights
            neighbor.g = tentativeG;
            neighbor.f = tentativeG + calculateHeuristic(neighbor, endNode);

            // Add neighbour to open list
            if (!openList.includes(neighbor)) {
                neighbor.known = true;
                openList.push(neighbor);
            }
        }

        // Set the grid state
        gridSetterFunc(grid);
        updater();
        
        // Wait some time
        await new Promise(r => setTimeout(r, 200));
    }

    // If no path is found, return null
    return null;
}
