function rehydrateGraph(path, target) {
  target = target || 'body';

  g = new Graph(target);

  d3.json(path, function(response) {
    response.nodes.map(function(node) {
      g.addNode(node);
    });

    response.links.map(function(link) {
      g.addLink(link);
    });
  });
}
