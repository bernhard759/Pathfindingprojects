import { immerable } from "immer";

/**
 * Node of the graph
 */
export default class GraphNode {
  [immerable] = true;
  id: number;
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isObstacle: boolean;
  isOnPath: boolean;
  parent: GraphNode | null;
  known: boolean;
  searched: boolean;
  g: number;
  f: number;
  constructor(id: number, r: number, c: number) {
    this.id = id;    
    this.row = r;
    this.col = c;
    this.isStart = false;
    this.isEnd = false;
    this.isObstacle = false;
    this.isOnPath = false;
    this.parent = null;
    this.known = false;
    this.searched = false;
    this.g = Infinity; // Way cost from start node
    this.f = Infinity; // Total cost
  }

  makeStart() {
    this.empty();
    this.isStart = true;
  }

  makeEnd() {
    this.empty();
    this.isEnd = true;
  }

  makeObstacle() {
    this.empty();
    this.isObstacle = true;
  }

  empty() {
    this.isStart = false;
    this.isEnd = false;
    this.isObstacle = false;
  }

  setParent(parentNode: GraphNode) {
    this.parent = parentNode;
  }

  removeParent() {
    this.parent = null;
  }
}