var temp;
var humidity;
var wind;
var APPID = "1e5de9c606dd04aa7cae701b97c5aaa0";

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 4.444997,
      lng: 106.554199
    },
    zoom: 6,
    mapTypeId: 'roadmap'
  });
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Moving the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  //Remove markers
  var gmarkers = [];

  function removeMarkers() {
    for (i = 0; i < gmarkers.length; i++) {
      gmarkers[i].setMap(null);
    }
  }


  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // Get the icon, name and location for each result
    var bounds = new google.maps.LatLngBounds();
    removeMarkers();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      markers = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      });


      gmarkers.push(markers);

      $(function() {
        var api = 'http://api.openweathermap.org/data/2.5/weather?id=' +
          '1735161' + '&APPID=' + APPID;
        $.getJSON({
          dataType: 'json',
          url: api,
          success: function(data) {
            temp = K2C(data.main.temp);
            humidity = data.main.humidity;
            wind = data.wind.speed;
            icon = data.weather[0].id;


            var contentString = '<div id="content">' +
              '<div id="siteNotice">' +
              '</div>' +
              '<h3 id="firstHeading" class="firstHeading">' + markers["title"] + '</h3>' +
              '<div id="bodyContent">' +
              '<div> <img id = "icon" width = "75px" src = "imgs/codes/' + icon + '.png" /> </div>' +
              '<div> temperature: ' + temp + '&degC</div>' +
              '<div> humidity: ' + humidity + '%' + '</div>' +
              '<div> wind speed: ' + wind + 'm/s ' + '</div>' +

              '</div>';

            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });

            markers.addListener('click', function() {
              infowindow.open(map, markers);
            });
          }
        });
      });


      //kelvin to celcius
      function K2C(k) {
        return Math.round(k - 273.15);
      }

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

}
