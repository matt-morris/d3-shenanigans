d3.xml("data/usaLow.svg", "image/svg+xml", function(xml) {
  document.body.appendChild(xml.documentElement);
  d3.select('svg')
    .attr('width', 1300)
    .attr('height', 850)
    .selectAll('path')
    .on('click', function(d) { console.log(d); });
});
