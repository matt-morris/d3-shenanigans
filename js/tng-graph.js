g = new Graph('body');

d3.json('data/tng.json', function(response) {
  response.map(function(el, i) {
    el.id = i;
    g.addNode(el);
  });
});
