function hex(graph) {
  graph = graph || new Graph();

  for (var i = 0; i < 6; i++) {
    graph.addNode({ charge: -75 });
  }

  for (var j = 0; j < 6; j++) {
    graph.addLink({ source: j % 6, target: (j+1) % 6, length: 20 });
  }

  return g;
}
