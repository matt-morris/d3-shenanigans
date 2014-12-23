console.log('force.js');

d3.select('body').append('style')
  .text('.node {stroke: #fff;stroke-width: 1.5px;}.link {stroke: #999;stroke-opacity:.6;}');

var width  = 960,
    height = 800;

var nodes = [],
    links = [];

var color = d3.scale.category20();

var svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height);

var force = d3.layout.force()
              .size([width, height])
              .nodes(nodes)
              .links(links)
              .charge(-120)
              .linkDistance(30)
              .start();

var link = svg.selectAll('.link')
      .data(links)
    .enter().append('line')
      .attr('class', 'link')
      .style('stroke-width', function(d) { return Math.sqrt(d.value); });

var node = svg.selectAll('.node')
    .data(nodes)
  .enter().append('circle')
    .attr('class', 'node')
    .attr('r', 5)
    .style('fill', function(d) { return color(d.id); })
    .call(force.drag);
    
node.append('title').text(function(d) { return d.name; });

force.on('tick', function() {
  link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

  node.attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; });
});