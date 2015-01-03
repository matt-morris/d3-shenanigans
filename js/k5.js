var k5 = new Graph('body');

for (var i = 0; i < 5; i++) {
  k5.addNode({ id: i });
  for (var j = 0; j < i; j++) {
    k5.addLink({ source: i, target: j });
  }
}
