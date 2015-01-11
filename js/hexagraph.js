function hex() {
  var g = new Graph();

  for (var i = 0; i < 6; i++) {
    g.addNode({ charge: -75 });
  }

  for (var j = 0; j < 6; j++) {
    g.addLink({ source: j % 6, target: (j+1) % 6, length: 20 });
  }

  return g;
}
