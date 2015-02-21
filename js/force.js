console.log('force.js');

function Graph(selector, options) {
  selector = selector || 'body';
  options = options || {};

  this.addNode = function(node) {
    node = node || {};
    if (typeof node === 'string') {
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
      if ((links[i].source === n) || (links[i].target === n)) links.splice(i, 1);
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
      } while (link.source === link.target);
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

  var selectBox;
  vis.on('mousedown.select_box', function() {
    selectBox = vis.append('svg:rect')
                   .attr('x', d3.event.pageX + 'px')
                   .attr('y', d3.event.pageY + 'px')
                   .attr('stroke', '#0f0')
                   .attr('fill', 'rgba(0, 255, 0, 0.4)');
  });

  vis.on('mousemove.select_box', function() {
    if (selectBox) {
      selectBox.attr('width', d3.event.pageX - selectBox[0][0].x.baseVal.value);
      selectBox.attr('height', d3.event.pageY - selectBox[0][0].y.baseVal.value);
    }
  });

  vis.on('mouseup.select_box', function() {
    if (selectBox) {
      nodes.filter(function(node) {
        var minX = selectBox[0][0].x.baseVal.value;
        var minY = selectBox[0][0].y.baseVal.value;
        var maxX = minX + selectBox[0][0].width.baseVal.value;
        var maxY = minY + selectBox[0][0].height.baseVal.value;
        if (node.x >= minX && node.x <= maxX &&
            node.y >= minY && node.y <= maxY) { node.selected = true; }
        update();
      });
      selectBox.remove();
      selectBox = null;
    }
  });

  var force = d3.layout.force()
                .gravity(0.05)
                .linkStrength(function(d) { return d.strength || 10; })
                .distance(function(d) { return d.length || 20; })
                .charge(function(d) { return d.charge || -15; })
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
    if (d3.event.altKey && d3.event.target.nodeName !== 'circle') {
      self.addNode({ x: d3.event.x, y: d3.event.y });
    }
  });

  var update = function() {
    var link = vis.selectAll('line.link')
                  .data(links, function(d) { return d.source.id + '-' + d.target.id; });

    link.enter().insert('line')
        .attr('class', 'link')
        .attr('stroke-width', '1.5px')
        .attr('stroke', '#0f0');

    link.exit().remove();

    var drag = force.drag();

    var node = vis.selectAll('g.node')
                  .data(nodes, function(d) { return d.id; });

    var nodeEnter = node.enter().append('g')
                        .attr('class', 'node')
                        .call(drag);

    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('stroke', '#0f0')
        .attr('stroke-width', '1.5px')
        .attr('r', function(d) { return d.size || 5; })
        .on('click', function(d) {
          if (d3.event.defaultPrevented) { return; }
          if (d3.event.metaKey) {
            togglePropertyEditor(d);
          }
          else {
            current = d;
            d.selected = ! d.selected;
            update();
          }
        })
        .on('dblclick.unfreeze', function(d) {
          d.fixed = false;
        })
        .on('mouseenter.hover', function(d) {
          var oldSize = parseInt(d.size, 10) || 5;
          d3.select(this).transition(150).attr('r', oldSize + 2);
        })
        .on('mouseout.hover', function(d) {
          var oldSize = parseInt(d.size, 10) || 7;
          d3.select(this).transition(150).attr('r', oldSize - 2);
        })
        .on('mouseup.freeze', function(d) {
          if (d3.event.shiftKey) { d.fixed = true; }
        })
        .on('mousedown.start_link', function(d) {
          current = d;
        })
        .on('mouseup.complete_link', function(d) {
          if (current) {
            self.addLink({ source: current.id, target: d.id });
          }
          current = null;
        });

    d3.select(document).on('keydown.disable_drag', function() {
      if (d3.event.which === 91) {
        d3.selectAll('.node').on('mousedown.drag', null);
      }
    }).on('keyup.enable_drag', function() {
      if (d3.event.which === 91) {
        d3.selectAll('.node').call(drag);
      }
    });

    node.attr('r', function(d) { return d.size || 5; })
        // .attr('fill', function(d) { return d.selected ? '#0f0' : d.color || color(d.id); });
        .attr('fill', function(d) { return d.selected ? '#222' : d.color || '#0f0'; });

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

  function togglePropertyEditor(node) {
    var editor = d3.select('body').append('div')
                   .style('position', 'absolute')
                   .style('top', (d3.event.pageX + 10) + 'px')
                   .style('left', (d3.event.pageY + 10) +'px')
                   .style('border', '3px solid black')
                   .style('border-radius', '10px')
                   .style('padding', '5px');

    editor.append('label').text(node.id + ':')
          .append('br');

    Object.keys(node).map(function(key) {
      editor.append('input')
            .attr('type', 'text')
            .attr('value', key)
            .attr('disabled', true);

      editor.append('input')
            .attr('type', 'text')
            .attr('value', node[key])
            .on('keyup.edit', function() {
              switch (d3.event.which) {
                case 13:
                  node[key] = this.value;
                  update();
                  break;
                case 27:
                  editor.remove();
                  break;
                default:
              }
              d3.event.stopPropagation();
            });
    });

    var newKey = editor.append('input').attr('type', 'text')
                       .on('keyup.editNew', function() {
                          switch (d3.event.which) {
                            case 27:
                              editor.remove();
                              break;
                            default:
                          }
                          d3.event.stopPropagation();
                        });

    editor.append('input')
          .attr('type', 'text')
          .on('keyup.editNew', function() {
            switch (d3.event.which) {
              case 13:
                node[newKey[0][0].value] = this.value;
                update();
                break;
              case 27:
                editor.remove();
                break;
              default:
            }
            d3.event.stopPropagation();
          });

    editor.append('input').attr('type', 'button')
          .attr('value', 'X')
          .on('click.closeEditor', function() { editor.remove(); });

    d3.select(newKey)[0][0][0][0].focus();
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

  d3.select(document).on('keydown', function() {
    switch (d3.event.which) {
      case 65:
        if (d3.event.metaKey) {
          nodes.map(function(node) {
            node.selected = true;
          });
          update();
        }
        break;
      default:
        //
    }
  });

  d3.select(document).on('keyup', function() {
    switch (d3.event.which) {
      case 65: // a
        if (!d3.event.metaKey) {
          self.addNode();
        }
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
