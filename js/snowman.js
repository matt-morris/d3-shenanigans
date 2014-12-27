console.log('snowman.');

// loadScript('force');

// d3.select('body').attr('color', '#f00')

g = new Graph('body');

g.addNode({ id: 'head', size: 40 });
g.addNode({ id: 'body', size: 75 });
g.addNode({ id: 'legs', size: 100 });

g.addLink('head', 'body');
g.addLink('body', 'legs');
