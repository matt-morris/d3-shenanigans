function hex() {
  var g = new Graph();
  for (var i = 0; i < 6; i++) {
    g.addNode({ charge: -75 });
  }

  for (var j = 0; j < 5; j++) {
    g.addLink({ source: j, target: j+1, length: 20 });
  }

  g.addLink({ source: 5, target: 0, length: 20 });

  return g;
}
