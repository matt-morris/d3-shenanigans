console.log('timeline.');

function Timeline(el, options) {
  options = options || {};
  options.width  = options.width || 960;
  options.height = options.height || 800;

  var vis = this.vis = d3.select(el).append('svg:svg')
                         .attr('width',  options.width)
                         .attr('height', options.height);

  var data = options.data || [];

  var scale = d3.time.scale()
                .domain([new Date('1901-01-01T00:00:00.000Z'), new Date()])
                .range([0, options.width]);

  vis.append('line')
     .attr('x1', 0)
     .attr('y1', 50)
     .attr('x2', options.width)
     .attr('y2', 50)
     .style('stroke', '#ccc');

  vis.selectAll('circle')
     .data(data).enter()
     .append('circle')
     .attr('r',  function(d) { return 3; })
     .attr('cx', function(d) { return scale(new Date(d.date)); })
     .attr('cy', function(d) { return 50; })
     .on('mouseenter', function(d) {
        d3.select(this)
          .transition(400)
          .attr('r', 5)
          .style('fill', '#fff')
          .style('stroke-width', 2)
          .style('stroke', 'black');

        d3.select(this)
          .on('mouseout', function(d) {
            d3.select(this)
              .transition(400)
              .attr('r', 3)
              .style('fill', '#f00')
              .style('stroke-width', 0);
          });
     })
     .style('fill', '#f00')
     .append('title').text(function(d) { return d.name + '\n' + d.date; });

  this.data = data;
}
