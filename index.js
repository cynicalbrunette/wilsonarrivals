var transitOptions = {
  departureTime: new Date(Date.now()),
  modes: ['TRAM'],
};
var directionsRequest = {
  origin: new google.maps.LatLng(41.965581, -87.6612554), // LatLng | String | google.maps.Place,
  destination: new google.maps.LatLng(41.895943, -87.645888), // LatLng | String | google.maps.Place,
  travelMode: 'TRANSIT',
  transitOptions: transitOptions,
  unitSystem: google.maps.UnitSystem.IMPERIAL,
  provideRouteAlternatives: true,
  avoidFerries: false,
};
const directionsService = new google.maps.DirectionsService;

directionsService.route(directionsRequest, function (result, status) {
  removeAllTiles();
  const rawRoutes = result.routes;
  const refinedRoutes = refineRoutes(rawRoutes);
  addToDocument(refinedRoutes);
});

setInterval(function() {
  directionsRequest.transitOptions.departureTime = new Date(Date.now());
  directionsService.route(directionsRequest, function (result, status) {
    removeAllTiles();
    const rawRoutes = result.routes;
    const refinedRoutes = refineRoutes(rawRoutes);
    addToDocument(refinedRoutes);
  });
}, 50000);


function refineRoutes(routes) {
  return routes;
}

function addToDocument(refinedRoutes) {
  refinedRoutes.forEach(function(route) {
    var tileDiv = document.createElement('div');
    var lineDiv = document.createElement('h1');
    var departureDiv = document.createElement('h1');

    tileDiv.classList.add('tile');
    lineDiv.classList.add('lineName');
    departureDiv.classList.add('departure');

    tileDiv.classList.add('row');
    lineDiv.classList.add('col-sm');
    departureDiv.classList.add('col-sm');

    const transitPart = route.legs[0].steps[1].transit;
    const line = transitPart.line.name;
    const departure = transitPart.departure_time.text;

    lineDiv.textContent = line;
    departureDiv.textContent = departure;

    if (line.substring(0,3) === 'Red') {
      tileDiv.classList.add('red');
    } else if (line.substring(0,3) === 'Pur') {
      tileDiv.classList.add('purple');
    }

    tileDiv.appendChild(lineDiv);
    tileDiv.appendChild(departureDiv);
    document.body.appendChild(tileDiv);
  });
}

function removeAllTiles() {
  var tiles = document.getElementsByClassName('tile');
  var numTiles = tiles.length;
  while (numTiles > 0) {
    numTiles -= 1;
    document.body.removeChild(tiles[numTiles]);
  }
}
