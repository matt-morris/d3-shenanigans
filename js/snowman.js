console.log('snowman.');

// loadScript('force');

// d3.select('body').attr('color', '#f00')

g = new Graph('body');

g.addNode({ id: 'head', size: 40,  color: '#fff' });
g.addNode({ id: 'body', size: 75,  color: '#fff' });
g.addNode({ id: 'legs', size: 100, color: '#fff' });

g.addLink('head', 'body');
g.addLink('body', 'legs');
