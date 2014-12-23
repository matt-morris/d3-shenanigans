console.log('d3-shenanigans.');

// cheap and dirty dynamic scripts...
window.loadScript = function(scriptName) {
  var scriptElement = document.createElement('script');
  scriptElement.src = 'js/' + scriptName + '.js';

  if (!window[scriptName]) {
    // document.write('<script src="js/'+ scriptName +'.js"><\/script>');
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
  }
};

// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function() {
//   if (xmlhttp.readyState == 4 ) {
//     if (xmlhttp.status == 200){
//       document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
//     }
//     else if (xmlhttp.status == 400) {
//       console.error('There was an error 400');
//     }
//     else {
//       console.warn('something else other than 200 was returned');
//     }
//   }
// }

// xmlhttp.open("GET", "config.json", true);
// xmlhttp.send();
