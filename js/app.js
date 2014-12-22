console.log('d3-shenanigans.');

// cheap and dirty dynamic scripts...
window.loadScript = function(script) {
  if (!window[script]) {
    document.write('<script src="js/'+ script +'.js"><\/script>');
  }
};
