function k(n, options) {
  n = n || 0;
  var selector;
  options = options || {};
  if (typeof options == 'string') {
    selector = options;
  }
  else {
    selector = options.selector || 'body';
  }
  graph = new Graph(selector, options);

  for (var i = 0; i < n; i++) {
    graph.addNode({ id: i });
    for (var j = 0; j < i; j++) {
      graph.addLink({ source: i, target: j });
    }
  }

  return graph;
}
