function k(n, selector) {
  selector = selector || 'body';
  var kn = new Graph(selector);

  for (var i = 0; i < n; i++) {
    kn.addNode({ id: i });
    for (var j = 0; j < i; j++) {
      kn.addLink({ source: i, target: j });
    }
  }
}
