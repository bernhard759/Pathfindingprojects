// HTML elements
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
let originalCanvasWidth = canvas.width;
let originalCanvasHeight = canvas.height;
const kruskalRadio = document.getElementById("kruskalRadio");
const primRadio = document.getElementById("primRadio");

/*------------------------------------------------*/

// Helper variables
let initial = true;
let first = true;

// The graph state
let graphData;

/**
 * Helper to generate a random number from min up to max
 * @param {*} min
 * @param {*} max
 * @returns
 */
function getRandomInteger(min, max) {
  const randomValue = Math.random();
  return Math.floor(randomValue * (max - min + 1)) + min;
}

/**
 * Helper to generate a random graph
 * @param {*} vertexCount
 * @returns
 */
function generateRandomGraph(vertexCount) {
  // The graph
  const graph = {
    vertices: [],
    edges: [],
  };

  // Generate random coordinates for vertices
  for (let i = 1; i <= vertexCount; i++) {
    const vertex = {
      id: i,
      x: getRandomInteger(20, canvas.width - 20),
      y: getRandomInteger(20, canvas.height - 20),
    };
    graph.vertices.push(vertex);
  }

  // Generate random edges
  for (let i = 0; i < vertexCount; i++) {
    const sourceVertex = graph.vertices[i];

    for (let j = i + 1; j < vertexCount; j++) {
      const destinationVertex = graph.vertices[j];
      const weight = getRandomInteger(1, 15);

      const edge = {
        source: sourceVertex,
        destination: destinationVertex,
        weight: weight,
      };

      graph.edges.push(edge);
    }
  }

  // Update the adjacency matrix
  updateAdjacencyMatrix(graph);

  return graph;
}

/*------------------------------------------------*/

/**
 * Union-find ADT with union by rank
 */
class UnionFind {
  // Make set
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i); // every node is its own parent
    this.rank = Array(size).fill(0); // rank for the size of the set
  }

  // Find
  find(x) {
    // node is not his own parent
    if (this.parent[x] !== x) {
      // Recursive find
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    // return the parent node
    return this.parent[x];
  }

  // Union
  union(x, y) {
    // Find the two nodes
    const rootX = this.find(x);
    const rootY = this.find(y);

    // The two nodes are in different sets
    if (rootX !== rootY) {
      // Union by rank
      // y node set is bigger
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
        // x node set is bigger
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      // the sets are equal
      } else {
        this.parent[rootX] = rootY;
        this.rank[rootY] += 1;
      }
    }
  }
}

const uf = new UnionFind(5);
console.log("union find", uf.parent, uf.rank);

/**
 * Find the MST using the kruskal algorithm
 * @param {*} graph
 * @returns
 */
function kruskal(graph) {
  // Init edges, union-find and the MST
  const edges = [...graph.edges].sort((a, b) => a.weight - b.weight); // Sort edges by weight
  const unionFind = new UnionFind(graph.vertices.length);
  const minimumSpanningTree = {
    vertices: [...graph.vertices],
    edges: [],
  };

  // Loop over all the edges in the graph
  for (const edge of edges) {
    // get the two nodes in the union find ADT
    const rootX = unionFind.find(graph.vertices.indexOf(edge.source));
    const rootY = unionFind.find(graph.vertices.indexOf(edge.destination));

    // Check if they are in the same set
    if (rootX !== rootY) {
      // Nodes are not in the same set
      // Push this edge to the MST edges
      minimumSpanningTree.edges.push(edge);
      // Merge the two sets
      unionFind.union(rootX, rootY);
    }
  }

  //console.log("MST", minimumSpanningTree)
  updateAdjacencyMatrix(minimumSpanningTree);
  return minimumSpanningTree;
}

/**
 * Find the MST using the kruskal algorithm without using a union-find ADT
 * @param {*} graph
 * @returns
 */
function kruskalsAlgorithm(graph) {
  // Sort edges based on their weights in ascending order
  const sortedEdges = graph.edges.slice().sort((a, b) => a.weight - b.weight);

  // Initialize disjoint set data structure
  const parent = new Map();

  graph.vertices.forEach((vertex) => {
    console.log(vertex);
    parent.set(vertex, vertex);
  });

  const find = (vertex) => {
    if (vertex !== parent.get(vertex)) {
      parent.set(vertex, find(parent.get(vertex)));
    }
    return parent.get(vertex);
  };

  // Initialize minimum spanning tree
  const minimumSpanningTree = {
    vertices: [...graph.vertices],
    edges: [],
  };

  // Iterate through sorted edges
  sortedEdges.forEach((edge) => {
    const sourceParent = find(edge.source);
    const destinationParent = find(edge.destination);

    // If adding the current edge doesn't form a cycle, add it to the minimum spanning tree
    if (sourceParent !== destinationParent) {
      minimumSpanningTree.edges.push(edge);
      parent.set(destinationParent, sourceParent);
    }
  });

  updateAdjacencyMatrix(minimumSpanningTree);

  return minimumSpanningTree;
}

/*------------------------------------------------*/

/**
 * Priority Queue class
 */
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  /**
   * Add an element to the queue
   * @param {*} element
   * @param {*} priority
   */
  enqueue(element, priority) {
    this.queue.push({ element, priority });
    this.sort();
  }

  /**
   * Remove the first element from the queue
   * @returns
   */
  dequeue() {
    return this.queue.shift();
  }

  /**
   * Sort the queue by priority
   */
  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Check if the queue is empty
   * @returns
   */
  isEmpty() {
    return this.queue.length === 0;
  }
}

/**
 * Prims algorithm for the MST
 * @param {*} graph
 * @returns
 */
function primsAlgorithm(graph) {
  // MST graph
  const minimumSpanningTree = {
    visited: new Set(),
    vertices: [],
    edges: [],
    addVertex(v) {
      this.vertices.push(v);
      this.visited.add(v);
    },
  };

  // Start with the first vertex
  let startVertex = graph.vertices[0];

  // Add the start vertex to the minimum spanning tree
  minimumSpanningTree.addVertex(startVertex);

  // Initialize the priority queue with edges connected to the start vertex
  const priorityQueue = new PriorityQueue();
  graph.edges.forEach((edge) => {
    if (edge.source === startVertex || edge.destination === startVertex) {
      priorityQueue.enqueue(edge, edge.weight);
    }
  });

  // Loop
  while (
    minimumSpanningTree.visited.size < graph.vertices.length &&
    !priorityQueue.isEmpty()
  ) {
    // Dequeue the minimum-weight edge
    const { element: minEdge } = priorityQueue.dequeue();

    // Determine the vertex of the minimum-weight edge
    const theVertex = minimumSpanningTree.visited.has(minEdge.source)
      ? minEdge.destination
      : minEdge.source;

    // Check if the vertex is not visited
    if (!minimumSpanningTree.visited.has(theVertex)) {
      // Add the vertex and the minimum-weight edge to the MST
      minimumSpanningTree.addVertex(theVertex);
      minimumSpanningTree.edges.push(minEdge);

      // Enqueue all edges connected to the vertex that connect to unvisited vertices
      graph.edges.forEach((edge) => {
        if (
          (edge.source === theVertex || edge.destination === theVertex) &&
          (!minimumSpanningTree.visited.has(edge.source) ||
            !minimumSpanningTree.visited.has(edge.destination))
        ) {
          priorityQueue.enqueue(edge, edge.weight);
        }
      });
    }
  }

  // Update the adjacency matrix
  updateAdjacencyMatrix(minimumSpanningTree);

  return minimumSpanningTree;
}

/*------------------------------------------------*/

function drawGraph(graph) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Scale factors for x and y coordinates
  const scaleX = canvas.width / originalCanvasWidth;
  const scaleY = canvas.height / originalCanvasHeight;

  console.log("redraw", canvas.width, canvas.height, scaleX, scaleY);

  // Adjust vertices
  graph.vertices.forEach((vertex) => {
    vertex.x *= scaleX;
    vertex.y *= scaleY;
  });

  // Draw edges as lines
  graph.edges.forEach((edge) => {
    ctx.beginPath();
    ctx.moveTo(edge.source.x, edge.source.y);
    ctx.lineTo(edge.destination.x, edge.destination.y);
    ctx.strokeStyle = "RGBA(0,0,0,0.6)"; // Line color
    ctx.lineWidth = 2; // Line width
    ctx.stroke();

    // Draw edge weight
    ctx.textAlign = "center";
    const midX = (edge.source.x + edge.destination.x) / 2;
    const midY = (edge.source.y + edge.destination.y) / 2;
    ctx.fillStyle = "RGBA(0, 0, 0, 0.85)";
    ctx.fillRect(midX - 5, midY - 8, 15, 10);
    ctx.fillStyle = "white"; // Weight color
    ctx.fillText(edge.weight.toString(), midX, midY);
  });

  // Draw vertices as circles with a radius of 10
  graph.vertices.forEach((vertex) => {
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "dodgerblue"; // Circle fill color
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(vertex.id, vertex.x, vertex.y + 2);
    ctx.stroke();
  });
}

/**
 * Create a new vertex with the given coordinates and add it to the graph with random-weighted edges to all other vertices
 * @param {*} x
 * @param {*} y
 * @param {*} graph
 */
function createNewVertex(x, y, graph) {
  console.log(x, y, graph);
  const newVertex = {
    id: Math.max(...graph.vertices.map((v) => v.id)) + 1,
    x: x,
    y: y,
  };

  // Connect the new vertex to all existing vertices with random weights
  graph.vertices.forEach((existingVertex) => {
    if (existingVertex !== newVertex) {
      const weight = getRandomInteger(1, 15);
      const edge = {
        source: newVertex,
        destination: existingVertex,
        weight: weight,
      };
      graph.edges.push(edge);
    }
  });

  // Add the vertex to the graph
  graph.vertices.push(newVertex);

  // Update the adjacency matrix
  updateAdjacencyMatrix(graph);
}

/*------------------------------------------------*/

/**
 * Draw the MST to the canvas
 */
function drawMST() {
  if (initial) {
    drawGraph(graphData);
  } else if (kruskalRadio.checked) {
    // Apply Kruskal's algorithm and draw the minimum spanning tree
    //const minimumSpanningTree = kruskalsAlgorithm(graphData);
    const minimumSpanningTree = kruskal(graphData); // Union-find ADT implementation
    //console.log(minimumSpanningTree);
    drawGraph(minimumSpanningTree);
  } else if (primRadio.checked) {
    // Apply Prim's algorithm and draw the minimum spanning tree
    const primMinimumSpanningTree = primsAlgorithm(graphData);
    //console.log(minimumSpanningTree)
    drawGraph(primMinimumSpanningTree);
  }
}

/*------------------------------------------------*/

/**
 * Draw a new vertex on the click position
 * @param {*} e
 */
function drawNewVertex(x, y) {
  // Create the new vertex
  createNewVertex(x, y, graphData);
  initial = false;
  drawMST();
}

/**
 * Remove a vertex from the graph
 * @param {*} id
 */
function removeVertex(id) {
  let vertexIndex = graphData.vertices.findIndex((v) => v.id === id);
  console.log(vertexIndex, graphData.vertices);
  if (vertexIndex !== -1) {
    let vertexToRemove = graphData.vertices[vertexIndex];
    graphData.vertices.splice(vertexIndex, 1);
    console.log(graphData.vertices);
    graphData.edges = graphData.edges.filter(
      (edge) =>
        edge.source !== vertexToRemove && edge.destination !== vertexToRemove
    );
  }
  drawMST();
}

/*------------------------------------------------*/

// Canvas resize
function resizeCanvas() {
  // Store original canvas dimensions for scaling
  originalCanvasWidth = canvas.width;
  originalCanvasHeight = canvas.height;

  //console.log("resize", originalCanvasWidth, originalCanvasHeight);

  // Resize the canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  drawMST();
}

/*------------------------------------------------*/

// Eventlisteners

// Canvas click
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  let vertexHere = graphData.vertices.find(
    (vertex) =>
      Math.abs(vertex.x - mouseX) <= 10 && Math.abs(vertex.y - mouseY) <= 10
  );
  if (vertexHere) {
    console.log("remove vertex with id " + vertexHere.id);
    removeVertex(vertexHere.id);
  } else {
    console.log("add vertex");
    drawNewVertex(mouseX, mouseY);
  }
});

// Button click
document.getElementById("new-graph").addEventListener("click", () => {
  graphData = generateRandomGraph(5);
  initial = true;
  // Draw the initial graph on the canvas
  drawGraph(graphData);
});

// Canvas resizing
window.addEventListener("resize", () => {
  console.log("resizing document");
  resizeCanvas();
});

// Document load
window.addEventListener("load", function () {
  // Resize the canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Store original canvas dimensions for scaling
  originalCanvasWidth = canvas.width;
  originalCanvasHeight = canvas.height;

  // The graph
  graphData = generateRandomGraph(5);

  // Draw the initial graph on the canvas
  drawGraph(graphData);
});

/*------------------------------------------------*/

// Adjacency matrix

/**
 * Function to update the adjacency matrix in the HTML div
 * @param {*} graph
 */
function updateAdjacencyMatrix(graph) {
  const adjacencyMatrixDiv = document.getElementById("adjacencyMatrix");
  adjacencyMatrixDiv.innerHTML = generateAdjacencyMatrixHTML(graph);
}

/**
 * Function to generate the HTML representation of the adjacency matrix
 * @param {*} graph
 * @returns
 */
function generateAdjacencyMatrixHTML(graph) {
  const sortedVertices = [...graph.vertices].sort((a, b) =>
    a.id > b.id ? 1 : -1
  );
  console.log("sorted");
  console.log(sortedVertices);

  let matrixHTML =
    '<table class="table table-bordered"><thead><tr><th scope="col"></th>';

  // Display column headers (vertex names)
  for (const vertex of sortedVertices) {
    matrixHTML += `<th scope="col">${vertex.id}</th>`;
  }

  matrixHTML += "</tr></thead><tbody>";

  // Display rows (vertex names) and adjacency matrix values
  for (const vertexRow of sortedVertices) {
    matrixHTML += "<tr>";
    matrixHTML += `<th scope="row">${vertexRow.id}</th>`;

    // Adjacency matrix values
    for (const vertexColumn of sortedVertices) {
      const weight = graph.edges.find(
        (edge) => edge.source === vertexRow && edge.destination === vertexColumn
      );
      const cellValue = weight ? weight.weight : "0";
      matrixHTML += `<td class="${
        parseInt(cellValue) !== 0 ? "bold-value" : ""
      }">${cellValue}</td>`;
    }

    matrixHTML += "</tr>";
  }

  matrixHTML += "</tbody></table>";
  return matrixHTML;
}
