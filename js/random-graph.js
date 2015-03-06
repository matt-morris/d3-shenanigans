console.log('random-graph');

var width = window.innerWidth;
var height = window.innerHeight;

var vis = d3.select('body').append('svg:svg')
            .attr('width', width)
            .attr('height', height);

var nodes = [];
var links = [];

for (var i = 0, j = Math.ceil(Math.random() * 100); i < j; i++) {
  nodes.push({ id: i });
}

nodes.map(function(node, index) {
  if (Math.random() < 0.5) {
    links.push({ source: nodes[index], target: nodes[Math.floor(Math.random() * nodes.length)] });
  }
});

var force = d3.layout.force()
              .size([width, height])
              .nodes(nodes)
              .links(links)
              .start();

var node = vis.selectAll('.node')
              .data(nodes)
              .enter().append('circle')
              .attr('class', 'node')
              .attr('r', function() { return 1 + Math.random() * 50; })
              .attr('fill', '#f22');

var link = vis.selectAll('.link')
              .data(links)
              .enter().append('line')
              .attr('class', 'link')
              .attr('stroke', '#f22')
              .attr('stroke-width', '2px');

force.on('tick', function() {
  link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

  node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
});
