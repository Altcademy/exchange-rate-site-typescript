export type AdjacencyList = {
  [key: string]: [string, number][]
}

type Distances = {
  [key: string]: number
}

type Predecessors = {
  [key: string]: string | null
}

function negateLog(adjacencyList: AdjacencyList) {
  const negatedLog: AdjacencyList = {};
  Object.keys(adjacencyList).forEach(key => {
    negatedLog[key] = adjacencyList[key].map(([node, weight]) => [node, -Math.log(weight)]);
  });
  return negatedLog;
}

function bellmanFord(adjacencyList: AdjacencyList, startNode: string) {
  const nodes = Object.keys(adjacencyList);
  const distances: Distances = {};
  const predecessors: Predecessors = {};

  // Step 1: initialize graph
  nodes.forEach((node) => {
    distances[node] = Infinity;
    predecessors[node] = null;
  });

  distances[startNode] = 0;

  // Step 2: relax edges repeatedly
  // for u,v in E:
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes.forEach((u) => {
      adjacencyList[u].forEach(([v, w]) => {
        if (distances[u] + w < distances[v]) {
          distances[v] = distances[u] + w;
          predecessors[v] = u;
        }
      });
    });
  }

  return {
    distances,
    predecessors,
  }
}

// trace negative weight cycle using predecessors
function traceNegativeWeightCycle(distances: Distances, predecessors: Predecessors, startNode: string) {
  const path = [startNode]
  let node: string = startNode
  let i = 0
  let stop = false
  while (distances[node] < 0 && predecessors[node]! !== startNode && i < 10 && !stop) {
    node = predecessors[node]!;
    if (path.includes(node)) {
      return path.reverse()
    }
    path.push(node);
    i += 1
  }
  return path.reverse();
}

// calculate gain
function calculateGain(adjacencyList: AdjacencyList, path: string[], startNode: string) {
  let u = startNode;
  let gain = 1;
  for (const v of path) {
    const w = adjacencyList[u].find(([node, _]) => node === v)![1];
    gain *= w;
    u = v;
  }
  return gain
}

export function returnNegativeWeightPath(adjacencyList: AdjacencyList, startNode: string) {
  const negatedLog = negateLog(adjacencyList);
  const { distances, predecessors } = bellmanFord(negatedLog, startNode);
  if (distances[startNode] >= 0) {
    return
  }
  const path = traceNegativeWeightCycle(distances, predecessors, startNode);
  if (path.length === 0) {
    return
  }
  const gain = calculateGain(adjacencyList, path, startNode);
  return { path, gain };
}
