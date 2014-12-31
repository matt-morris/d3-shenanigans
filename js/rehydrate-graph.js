g = new Graph('body');

d3.json('data/example-graph.json', function(response) {
  response.nodes.map(function(node) {
    g.addNode(node);
  });

  response.links.map(function(link) {
    g.addLink(link.source, link.target);
  });
});
