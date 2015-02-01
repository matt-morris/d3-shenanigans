console.log('force.js');

d3.select('head').append('style')
  .text('.node {stroke: #fff;stroke-width: 1.5px;}.link {stroke: #999;stroke-opacity:.6;}');

function Graph(selector, options) {
  selector = selector || 'body';
  options = options || {};

  this.addNode = function(node) {
    node = node || {};
    if (typeof node == 'string') {
      node = { id: node };
    }

    node.id = node.id || nodes.length;
    nodes.push(node);
    update();

    return node;
  };

  this.removeNode = function(id) {
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

  this.addLink = function(link) {
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

  this.nodesWhere = function(q) {
    var keys = Object.keys(q);
    return nodes.filter(function(node) {
      return keys.filter(function(key) {
        return node[key] == q[key]; }).length === keys.length;
    });
  };

  this.linksWhere = function(q) {
    var keys = Object.keys(q);
    return links.filter(function(link) {
      return keys.filter(function(key) {
        return link[key] == q[key]; }).length === keys.length;
    });
  };

  var findNode = function(id) {
    return nodes.filter(function(node) { return node.id === id; })[0];
  };
  this.findNode = findNode;

  var replaceNode = function(id, node) {
    var i = findNode(id);
    if (i) {
      nodes[i] = node;
      update();
    }
  };
  this.replaceNode = replaceNode;

  var findNodeIndex = function(id) {
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
                .linkStrength(10)
                .distance(function(d) { return d.length || 20; })
                .charge(function(d) { return d.charge || -5; })
                .size([w, h]);

  var nodes = force.nodes(),
      links = force.links();

  var self = this;

  var current;

  var joinSelected = function() {
    var selected = self.nodesWhere({ selected: true });

    selected.map(function(source) {
      selected.map(function(target) {
        if (target !== selected) {
          links.push({ source: source, target: target });
        }
      });
    });

    update();
  };

  vis.on('click', function() {
    // console.log(d3.event)
    if (d3.event.altKey && d3.event.target.nodeName != 'circle') {
      self.addNode();
    }
  });

  var update = function() {
    var link = vis.selectAll('line.link')
                  .data(links, function(d) { return d.source.id + '-' + d.target.id; });

    link.enter().insert('line')
        .attr('class', 'link');

    link.exit().remove();

    var drag = force.drag();

    var node = vis.selectAll('g.node')
                  .data(nodes, function(d) { return d.id; });

    var nodeEnter = node.enter().append('g')
                        .attr('class', 'node')
                        .call(drag);

    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', function(d) { return d.size || 5; })
        .on('click', function(d) {
          if (d3.event.defaultPrevented) { return; }
          current = d;
          d.selected = ! d.selected;
          update();
        })
        .on('dblclick.unfreeze', function(d) {
          d.fixed = false;
        })
        .on('mouseenter.resize', function(d) {
          d3.select(this).transition(150).attr('r', (d.size || 0) + 7);
        })
        .on('mouseout.resize', function(d) {
          d3.select(this).transition(250).attr('r', (d.size || 7) - 2);
        })
        .on('mouseup.freeze', function(d) {
          if (d3.event.shiftKey) { d.fixed = true; }
        });

    d3.select(document).on('keydown.disable_drag', function() {
      if (d3.event.which === 91) {
        d3.selectAll('.node').on('mousedown.drag', null)
      }
    }).on('keyup.enable_drag', function() {
      if (d3.event.which === 91) {
        d3.selectAll('.node').call(drag);
      }
    })

    node.attr('r', function(d) { return d.size || 5; })
        .attr('fill', function(d) { return d.selected ? '#0f0' : color(d.id); });

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
  this.update = update;

  // Make it all go
  function resize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    vis.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
  }

  var reticle;
  var mouse = { x: 0, y: 0, prevX: 0, prevY: 0 };
  d3.select(document).on('mousemove', function() {
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = d3.event.x;
    mouse.y = d3.event.y;

    if (reticle) {
      reticle.attr('cx', mouse.x - 9).attr('cy', mouse.y - 9);
    }
  });

  function toggleReticle() {
    if (reticle) {
      reticle.remove();
      reticle = undefined;
    }
    else {
      reticle = vis.append('circle')
                   .attr('r', 20)
                   .attr('cx', mouse.x)
                   .attr('cy', mouse.y)
                   .style('stroke-width', '2px')
                   .style('stroke', '#000')
                   .style('fill', 'rgba(255,255,255,0.5)');

      reticle.on('click', function() {
        var point = d3.mouse(this);

        if (d3.event.metaKey) {
          self.addNode({ x: point[0], y: point[1] });
        }

        var targets = nodes.filter(function(target) {
          var x = target.x - point[0],
              y = target.y - point[1];
          return Math.sqrt(x * x + y * y) < 20;
        });

        targets.map(function(source) {
          targets.map(function(target) {
            if (source !== target) {
              links.push({ source: source, target: target });
            }
          });
        });

        update();
      });
    }
  }

  d3.select(document).on('keyup', function() {
    switch (d3.event.which) {
      case 65: // a
        self.addNode();
        break;
      case 68:
        self.nodesWhere({ selected: true })
            .map(function(node) { self.removeNode(node.id); });
        break;
      case 90: // z
        toggleReticle();
        break;
      case 74: // j
        joinSelected();
        break;
      case 27:
        self.nodesWhere({ selected: true }).map(function(node) {
          node.selected = false;
        });
        update();
        break;
      default:
        // console.log(d3.event.which, d3.event);
      }
  });

  resize();
  d3.select(window).on("resize", resize);
  update();
}
