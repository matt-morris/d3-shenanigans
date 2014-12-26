console.log('snowman.');

// loadScript('force');

// d3.select('body').attr('color', '#f00')

g = new Graph('body');

g.addNode({ id: 'head' });
g.addNode({ id: 'body' });
g.addNode({ id: 'legs' });

g.addLink('head', 'body');
g.addLink('body', 'legs');
