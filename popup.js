var api_key = "AIzaSyCA2MAZC4UHHyTDXSCE4x6ZNKm4AnjFEi4";

function loadScript(src, callback)
{
  var s,
      r,
      t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  s.onload = s.onreadystatechange = function() {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      callback();
    }
  };
  t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(s, t);
}



function initMap() {
  
  // Initialize map
  var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: {lat:-34.397,lng:150.644}});

  // Initialize geocoding service
  var geocoder = new google.maps.Geocoder();
  
  // Get selected text from content script
  chrome.tabs.query({active:true,currentWindow:true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {method: "getSelection"}, function (response) {
      var selectedText = response.data;

      // Get geocoding data from selected text
      geocoder.geocode( { 'address': selectedText }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(results);
          map.setCenter(results[0].geometry.location);
          if (results[0].place_id) {
            markerOptions = {
              map: map,
              place: {
                location: results[0].geometry.location,
                placeId: results[0].place_id
              }
            }
          } else {
            markerOptions = {
              map: map,
              position: results[0].geometry.location
            }
          }
          var marker = new google.maps.Marker(markerOptions);

          // Construct a new InfoWindow and opens it
          var infoWindow = new google.maps.InfoWindow({
            content: selectedText
          });
          infoWindow.open(map, marker);

          // Opens the InfoWindow when marker is clicked.
          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });
        } else {
          // alert("Geocode was not successful for the following reason: " + status);
        }
      });
    });
  });

}

loadScript("https://maps.googleapis.com/maps/api/js?key="+api_key+"&signed_in=true", initMap);
