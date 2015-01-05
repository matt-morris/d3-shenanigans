console.log('force.js');

d3.select('head').append('style')
  .text('.node {stroke: #fff;stroke-width: 1.5px;}.link {stroke: #999;stroke-opacity:.6;}');


function Graph(selector, options) {
    selector = selector || 'body';
    options = options || {};

    this.addNode = function (node) {
      node = node || {};
      if (typeof node == 'string') {
        node = { id: node };
      }

      node.id = node.id || nodes.length;
      nodes.push(node);
      update();

      return node;
    };

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
          if ((links[i]['source'] === n) || (links[i]['target'] == n)) links.splice(i, 1);
          else i++;
        }
        var index = findNodeIndex(id);
        if (index !== undefined) {
          nodes.splice(index, 1);
          update();
        }
    };

    this.addLink = function (link) {
        link.source = findNode(link.source);
        link.target = findNode(link.target);

        if ((link.source !== undefined) && (link.target !== undefined)) {
          links.push(link);
          update();
          return link;
        }
        else {
          console.error(new Error(link));
        }
    };

    this.addRandomLink = function() {
      var link = {};
      if (nodes.length > 1) {
        link.source = Math.floor(Math.random() * nodes.length);
        do {
          link.target = Math.floor(Math.random() * nodes.length);
        } while (link.source == link.target);
        this.addLink(link);
        return link;
      }
    };

    this.toJSON = function() {
      return JSON.stringify({
        nodes: nodes,
        links: links.map(function(link) {
          link.source = link.source.id;
          link.target = link.target.id;
          return link;
        })
      });
    };

    var findNode = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return nodes[i];
        }
    };

    var findNodeIndex = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return i;
        }
    };

    // set up the D3 visualisation in the specified element
    var w = options.width || 960,
        h = options.height || 800;

    var color = d3.scale.category20();
    var vis = this.vis = d3.select(selector).append('svg:svg')
        .attr('width', w)
        .attr('height', h);

    var force = d3.layout.force()
                  .gravity(0.05)
                  .distance(function(d) { return d.length || 100; })
                  .charge(function(d) { return d.charge || -5; })
                  .size([w, h]);

    var nodes = force.nodes(),
        links = force.links();

    var update = function() {
      var link = vis.selectAll('line.link')
                    .data(links, function(d) { return d.source.id + '-' + d.target.id; });

      link.enter().insert('line')
          .attr('class', 'link');

      link.exit().remove();

      var node = vis.selectAll('g.node')
                    .data(nodes, function(d) { return d.id; });

      var nodeEnter = node.enter().append('g')
                          .attr('class', 'node')
                          .call(force.drag);

      nodeEnter.append('circle')
          .attr('class', 'node')
          .attr('r', function(d) { return d.size || 5; })
          .style('fill', function(d) { return d.color || color(d.id); })
          .call(force.drag);

      node.append('title')
          .text(function(d) { return d.id + (d.name ? ': \n' + d.name : ''); });

      node.exit().remove();

      force.on('tick', function() {
        link.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

        node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
      });

      // Restart the force layout.
      force.start();
  };

  // Make it all go
  update();
}
