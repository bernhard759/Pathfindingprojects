import { immerable } from "immer";
import GraphNode from "./Node";

export default class GraphGrid {
    [immerable] = true;
    rows: number;
    cols: number;
    nodes: GraphNode[][];
    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.nodes = this.createNodes();
    }

    createNodes() {
        const nodes: GraphNode[][] = [];
        for (let row = 0; row < this.rows; row++) {
            nodes[row] = [];
            for (let col = 0; col < this.cols; col++) {
                nodes[row][col] = new GraphNode(Number(`${row}00${col}`), row, col);
            }
        }
        return nodes;
    }

    getNode(row: number, col: number) {
        return this.nodes[row][col];
    }

    getAllNodes() {
        return this.nodes.flat();
    }

    reset(all:boolean=false) {
        this.getAllNodes().forEach(node => {
            node.isOnPath = false;
            node.parent = null;
            node.known = false;
            node.searched = false;
            node.g = Infinity;
            node.f = Infinity;
            if (all) {
                node.isObstacle = false;
            }
        })
    }
}