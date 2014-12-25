console.log('d3-shenanigans.');

// cheap and dirty dynamic scripts...
window.loadScript = function(scriptName) {
  var scriptElement = document.createElement('script');
  scriptElement.src = 'js/' + scriptName + '.js';

  if (!window[scriptName]) {
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
  }
};

// loadScript('force');

function tngTimeline(el) {
  el = el || 'body';
  loadScript('timeline');
  d3.json('data/tng.json', function(error, response) {
    t = new Timeline(el, { data: response });
  });
}
