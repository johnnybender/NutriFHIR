// global variables

var map = null;
var autocomplete = null
var startLoc = null
var geocoder = null
//var p_marker = null
var p_infowindowContent = null
var p_infowindow = null
var infowindow = null
var service = null;

var csMarkers = [];
var smMarkers = [];
var fmMarkers = [];
var gmarkers = [];

var storeTypeIdMap = {};
var rowContentMap = {};
var rowMarkerMap = {};

var CS_Rows = [];
var SM_Rows = [];
var FM_Rows = [];

var preferredMarkers = [];

var starIdMarkerMap = {};

var goldStar = {
  path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
  fillColor: 'yellow',
  fillOpacity: 1,
  scale: 0.08,
  strokeColor: 'black',
  strokeWeight: 0.8
};


// variable to store each query type for google maps
var CS = {};
var FM = {};
var SM = {};

// Carefully set colors

function plotMap(address, queryType) {

  d3.select("#CS_label").style('color', '#ff7f7f');
  d3.select("#SM_label").style('color', '#9999ff');
  d3.select("#FM_label").style('color', '#99c199');

  var destMarkers = [];

  var noAutoComplete = true;
  var noQuery = true;
  var initialService = null;
  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(100, 30),
    maxWidth: 125
  });
  startLoc = new google.maps.LatLng(40.7902778, -73.9597222); // Manhattan, NY
  var circle = new google.maps.Circle({
    center: startLoc,
    radius: 5 * 1609.34, // 10 miles
    strokeWeight: 2,
    strokeColor: "black",
    strokeOpacity: 0.9,
    fillColor: "red",
    fillOpacity: 0.15,
    clickable: false,
    map: map
  });
  // convenience store
  CS = {
    // path: 'M19.006,2.97c-0.191-0.219-0.466-0.345-0.756-0.345H4.431L4.236,1.461     C4.156,0.979,3.739,0.625,3.25,0.625H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124     c0.016,0.053,0.029,0.103,0.054,0.151c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112     c0.058,0.054,0.125,0.092,0.193,0.13c0.038,0.021,0.071,0.049,0.112,0.065c0.116,0.047,0.238,0.075,0.367,0.075     c0.001,0,11.001,0,11.001,0c0.553,0,1-0.447,1-1s-0.447-1-1-1H6.097l-0.166-1H17.25c0.498,0,0.92-0.366,0.99-0.858l1-7     C19.281,3.479,19.195,3.188,19.006,2.97z M17.097,4.625l-0.285,2H13.25v-2H17.097z M12.25,4.625v2h-3v-2H12.25z M12.25,7.625v2     h-3v-2H12.25z M8.25,4.625v2h-3c-0.053,0-0.101,0.015-0.148,0.03l-0.338-2.03H8.25z M5.264,7.625H8.25v2H5.597L5.264,7.625z      M13.25,9.625v-2h3.418l-0.285,2H13.25z',
    path: 'M13.864,6.136c-0.22-0.219-0.576-0.219-0.795,0L10,9.206l-3.07-3.07c-0.219-0.219-0.575-0.219-0.795,0 c-0.219,0.22-0.219,0.576,0,0.795L9.205,10l-3.07,3.07c-0.219,0.219-0.219,0.574,0,0.794c0.22,0.22,0.576,0.22,0.795,0L10,10.795  l3.069,3.069c0.219,0.22,0.575,0.22,0.795,0c0.219-0.22,0.219-0.575,0-0.794L10.794,10l3.07-3.07 C14.083,6.711,14.083,6.355,13.864,6.136z M10,0.792c-5.086,0-9.208,4.123-9.208,9.208c0,5.085,4.123,9.208,9.208,9.208 s9.208-4.122,9.208-9.208C19.208,4.915,15.086,0.792,10,0.792z M10,18.058c-4.451,0-8.057-3.607-8.057-8.057  c0-4.451,3.606-8.057,8.057-8.057c4.449,0,8.058,3.606,8.058,8.057C18.058,14.45,14.449,18.058,10,18.058z',
    fillColor: 'red',
    fillOpacity: 0.9,
    scale: 0.8,
    strokeColor: 'red',
    strokeWeight: 0.1,
    scaledSize: new google.maps.Size(20,20)
  };
  // supermarket
  SM = {
    path: 'M17.671,13.945l0.003,0.002l1.708-7.687l-0.008-0.002c0.008-0.033,0.021-0.065,0.021-0.102c0-0.236-0.191-0.428-0.427-0.428H5.276L4.67,3.472L4.665,3.473c-0.053-0.175-0.21-0.306-0.403-0.306H1.032c-0.236,0-0.427,0.191-0.427,0.427c0,0.236,0.191,0.428,0.427,0.428h2.902l2.667,9.945l0,0c0.037,0.119,0.125,0.217,0.239,0.268c-0.16,0.26-0.257,0.562-0.257,0.891c0,0.943,0.765,1.707,1.708,1.707S10,16.068,10,15.125c0-0.312-0.09-0.602-0.237-0.855h4.744c-0.146,0.254-0.237,0.543-0.237,0.855c0,0.943,0.766,1.707,1.708,1.707c0.944,0,1.709-0.764,1.709-1.707c0-0.328-0.097-0.631-0.257-0.891C17.55,14.182,17.639,14.074,17.671,13.945 M15.934,6.583h2.502l-0.38,1.709h-2.312L15.934,6.583zM5.505,6.583h2.832l0.189,1.709H5.963L5.505,6.583z M6.65,10.854L6.192,9.146h2.429l0.19,1.708H6.65z M6.879,11.707h2.027l0.189,1.709H7.338L6.879,11.707z M8.292,15.979c-0.472,0-0.854-0.383-0.854-0.854c0-0.473,0.382-0.855,0.854-0.855s0.854,0.383,0.854,0.855C9.146,15.596,8.763,15.979,8.292,15.979 M11.708,13.416H9.955l-0.189-1.709h1.943V13.416z M11.708,10.854H9.67L9.48,9.146h2.228V10.854z M11.708,8.292H9.386l-0.19-1.709h2.512V8.292z M14.315,13.416h-1.753v-1.709h1.942L14.315,13.416zM14.6,10.854h-2.037V9.146h2.227L14.6,10.854z M14.884,8.292h-2.321V6.583h2.512L14.884,8.292z M15.978,15.979c-0.471,0-0.854-0.383-0.854-0.854c0-0.473,0.383-0.855,0.854-0.855c0.473,0,0.854,0.383,0.854,0.855C16.832,15.596,16.45,15.979,15.978,15.979 M16.917,13.416h-1.743l0.189-1.709h1.934L16.917,13.416z M15.458,10.854l0.19-1.708h2.218l-0.38,1.708H15.458z',
    // path: 'M19.006,2.97c-0.191-0.219-0.466-0.345-0.756-0.345H4.431L4.236,1.461     C4.156,0.979,3.739,0.625,3.25,0.625H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124     c0.016,0.053,0.029,0.103,0.054,0.151c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112     c0.058,0.054,0.125,0.092,0.193,0.13c0.038,0.021,0.071,0.049,0.112,0.065c0.116,0.047,0.238,0.075,0.367,0.075     c0.001,0,11.001,0,11.001,0c0.553,0,1-0.447,1-1s-0.447-1-1-1H6.097l-0.166-1H17.25c0.498,0,0.92-0.366,0.99-0.858l1-7     C19.281,3.479,19.195,3.188,19.006,2.97z M17.097,4.625l-0.285,2H13.25v-2H17.097z M12.25,4.625v2h-3v-2H12.25z M12.25,7.625v2     h-3v-2H12.25z M8.25,4.625v2h-3c-0.053,0-0.101,0.015-0.148,0.03l-0.338-2.03H8.25z M5.264,7.625H8.25v2H5.597L5.264,7.625z      M13.25,9.625v-2h3.418l-0.285,2H13.25z',
    fillColor: 'blue',
    fillOpacity: 0.8,
    scale: 0.9,
    strokeColor: 'blue',
    strokeWeight: 0.1,
    scaledSize: new google.maps.Size(20,20)
  };
  // farmers market icon
  FM = {
    path: 'M9.727,7.292c0.078,0.078,0.186,0.125,0.304,0.125c0.119,0,0.227-0.048,0.304-0.125l1.722-1.722c0.078-0.078,0.126-0.186,0.126-0.305c0-0.237-0.192-0.43-0.431-0.43c-0.118,0-0.227,0.048-0.305,0.126l-0.986,0.987V1.822c0-0.237-0.193-0.43-0.431-0.43s-0.431,0.193-0.431,0.43v4.126L8.614,4.961C8.537,4.884,8.429,4.835,8.31,4.835c-0.238,0-0.43,0.193-0.43,0.43c0,0.119,0.048,0.227,0.126,0.305L9.727,7.292z M18.64,8.279H1.423c-0.475,0-0.861,0.385-0.861,0.86V10c0,0.476,0.386,0.861,0.861,0.861h0.172l1.562,7.421l0.008-0.002c0.047,0.187,0.208,0.328,0.41,0.328h12.912c0.201,0,0.362-0.142,0.409-0.328l0.009,0.002l1.562-7.421h0.173c0.475,0,0.86-0.386,0.86-0.861V9.139C19.5,8.664,19.114,8.279,18.64,8.279 M2.475,10.861h2.958l0.271,1.721H2.837L2.475,10.861z M3.018,13.443h2.823l0.271,1.722H3.38L3.018,13.443z M3.924,17.747l-0.362-1.722h2.687l0.271,1.722H3.924z M9.601,17.747H7.38l-0.271-1.722h2.491V17.747z M9.601,15.165H6.973l-0.271-1.722h2.899V15.165z M9.601,12.582H6.565l-0.271-1.721h3.307V12.582z M12.682,17.747h-2.22v-1.722h2.491L12.682,17.747z M13.09,15.165h-2.628v-1.722h2.899L13.09,15.165z M10.462,12.582v-1.721h3.307l-0.271,1.721H10.462z M16.139,17.747h-2.596l0.271-1.722H16.5L16.139,17.747z M16.683,15.165H13.95l0.271-1.722h2.823L16.683,15.165z M17.226,12.582h-2.867l0.271-1.721h2.958L17.226,12.582z M18.64,10H1.423V9.139H18.64V10z',
    fillColor: 'green',
    fillOpacity: 0.9,
    scale: 0.8,
    strokeColor: 'green',
    strokeWeight: 0.1,
    scaledSize: new google.maps.Size(20,20)
  };

  var queries = ['Groceries', 'Supermarkets', 'Farmers Markets'];
  var query1 = queries[0];
  var query2 = queries[1];
  var query3 = queries[2];


  initialize();
  storeTypeIdMap["CS"] = CS_Rows;
  storeTypeIdMap["SM"] = SM_Rows;
  storeTypeIdMap["FM"] = FM_Rows;


  function callbackCS(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var places = [];
      gmarkers = [];

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        places.push(place);
        createMarker(results[i], CS);
      }

      var marker = new google.maps.Marker({
        position: startLoc,
        map: map,
      });

      map.fitBounds(circle.getBounds());
      google.maps.event.trigger(map, 'resize');
      map.panTo(startLoc);
      map.setZoom(map.getZoom() + 1);
      // if (markers.length == 1) map.setZoom(17);
      var destArray = [];
      destMarkers = [];

      var minDist = Number.MAX_VALUE;

      var htmlString = "Nearby " + queryType + " : " + "\n";

      for (var i = 0; i < gmarkers.length; i++) {

        var streetAddr = results[i].formatted_address.split(',')[0];
        var idToCheck = 'A' + streetAddr.split(' ').join('_');
        if (idToCheck in rowContentMap)
          gmarkers[i].setMap(null);
        else {
          var currDist = google.maps.geometry.spherical.computeDistanceBetween(startLoc, gmarkers[i].getPosition());
          if (currDist < 5 * 1609.34) { // 1609.34 meters/mile

            //htmlString = htmlString + "\n" + "\n" +results[i].name + "\n" + results[i].formatted_address +  "(" + Number(Math.round( currDist / 1609.34 +'e2')+'e-2') + " miles away)";
            createTableRows(results[i].name, results[i].formatted_address.split(',')[0], '#ff7f7f');
            CS_Rows.push(idToCheck);
            rowMarkerMap[idToCheck] = gmarkers[i]

            destArray.push(gmarkers[i].getPosition());
            destMarkers.push(gmarkers[i]);
            csMarkers.push(gmarkers[i]);
          }
          else
            gmarkers[i].setMap(null);
        }

      }

      $("#groceryInfo").text(htmlString);

    }
  }

  function callbackSM(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var places = [];
      gmarkers = [];

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        places.push(place);
        createMarker(results[i], SM);
      }

      var marker = new google.maps.Marker({
        position: startLoc,
        map: map,

      });

      map.fitBounds(circle.getBounds());
      google.maps.event.trigger(map, 'resize');
      map.panTo(startLoc);
      map.setZoom(map.getZoom() + 1);
      // if (markers.length == 1) map.setZoom(17);
      var destArray = [];
      destMarkers = [];

      var minDist = Number.MAX_VALUE;

      var htmlString = "Nearby " + queryType + " : " + "\n";

      for (var i = 0; i < gmarkers.length; i++) {

        var streetAddr = results[i].formatted_address.split(',')[0];
        var idToCheck = 'A' + streetAddr.split(' ').join('_');
        if (idToCheck in rowContentMap)
          gmarkers[i].setMap(null);
        else {
          var currDist = google.maps.geometry.spherical.computeDistanceBetween(startLoc, gmarkers[i].getPosition());
          if (currDist < 5 * 1609.34) { // 1609.34 meters/mile

            createTableRows(results[i].name, results[i].formatted_address.split(',')[0], '#9999ff');
            SM_Rows.push(idToCheck);
            rowMarkerMap[idToCheck] = gmarkers[i]

            destArray.push(gmarkers[i].getPosition());
            destMarkers.push(gmarkers[i]);
            smMarkers.push(gmarkers[i]);
          }
          else
            gmarkers[i].setMap(null);
        }

      }

      $("#groceryInfo").text(htmlString);

    }
  }

  function callbackFM(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var places = [];
      gmarkers = [];

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        places.push(place);
        createMarker(results[i], FM);
      }

      var marker = new google.maps.Marker({
        position: startLoc,
        map: map,

      });

      map.fitBounds(circle.getBounds());
      google.maps.event.trigger(map, 'resize');
      map.panTo(startLoc);
      map.setZoom(map.getZoom() + 1);
      // if (markers.length == 1) map.setZoom(17);
      var destArray = [];
      destMarkers = [];

      var minDist = Number.MAX_VALUE;

      var htmlString = "Nearby " + queryType + " : " + "\n";

      for (var i = 0; i < gmarkers.length; i++) {

        var streetAddr = results[i].formatted_address.split(',')[0];
        var idToCheck = 'A' + streetAddr.split(' ').join('_');
        if (idToCheck in rowContentMap)
          gmarkers[i].setMap(null);
        else {
          var currDist = google.maps.geometry.spherical.computeDistanceBetween(startLoc, gmarkers[i].getPosition());
          if (currDist < 5 * 1609.34) { // 1609.34 meters/mile

            //htmlString = htmlString + "\n" + "\n" +results[i].name + "\n" + results[i].formatted_address +  "(" + Number(Math.round( currDist / 1609.34 +'e2')+'e-2') + " miles away)";

            createTableRows(results[i].name, results[i].formatted_address.split(',')[0], '#99c199');
            rowMarkerMap[idToCheck] = gmarkers[i]
            FM_Rows.push(idToCheck);

            destArray.push(gmarkers[i].getPosition());
            destMarkers.push(gmarkers[i]);
            fmMarkers.push(gmarkers[i]);
          }
          else
            gmarkers[i].setMap(null);
        }

      }

      $("#groceryInfo").text(htmlString);

    }
  }


  function initialize() {

    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(40.65, -73.95), // Brooklyn, NY
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false
    });
    //circle.setMap(map);
    service = new google.maps.places.PlacesService(map);
    initialService = new google.maps.places.PlacesService(map);

    input = document.getElementById('searchInput');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    p_infowindow = new google.maps.InfoWindow();
    p_infowindowContent = document.getElementById('infowindow-content');
    p_infowindow.setContent(p_infowindowContent);

    var p_marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
      icon: goldStar
    });


    function plotCS(iQuery) {

      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          startLoc = results[0].geometry.location;
          circle.setCenter(startLoc);
          var request = {
            bounds: circle.getBounds(),
            query: iQuery
          };
          initialService.textSearch(request, callbackCS);
        } else {
          alert("geocode failed:" + status);
        }
      });

    }

    function plotSM(iQuery) {

      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          startLoc = results[0].geometry.location;
          circle.setCenter(startLoc);
          var request = {
            bounds: circle.getBounds(),
            query: iQuery
          };
          initialService.textSearch(request, callbackSM);
        } else {
          alert("geocode failed:" + status);
        }
      });

    }

    function plotFM(iQuery) {

      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          startLoc = results[0].geometry.location;
          circle.setCenter(startLoc);
          var request = {
            bounds: circle.getBounds(),
            query: iQuery
          };
          initialService.textSearch(request, callbackFM);
        } else {
          alert("geocode failed:" + status);
        }
      });

    }

    plotCS(query1);
    plotSM(query2);
    plotFM(query3);

    //map.setZoom(map.getZoom() + 1);


    var groceryCard = document.getElementById('GroceryCardMap');
    var groceryCardDim = groceryCard.getBoundingClientRect();
    var height = groceryCardDim.height * 3.0;
    var width = groceryCardDim.width * 1.4;

    var svg2 = d3.select("#mapChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var svg3 = d3.select("#groceryInfo")
      .append("svg")
      .attr("width", 0.2 * width)
      .attr("height", 0.7 * height);



  }

  function createMarker(place, markerIcon) {
    var placeLoc = place.geometry.location;
    if (place.icon) {
      var image = {
        url: place.icon,
        // size:new google.maps.Size(71, 71),
        // origin: new google.maps.Point(0, 0), 
        // anchor:new google.maps.Point(35, 0),
        scaledSize: new google.maps.Size(13, 13)
      };
    } else var image = null;


    var marker = new google.maps.Marker({
      map: map,
      icon: markerIcon,
      position: place.geometry.location,
      reference: place.reference
    });



    var request = {
      reference: place.reference
    };

    google.maps.event.addListener(marker, 'click', function () {
      infowindow.marker = marker;
      service.getDetails(request, function (place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var contentStr = '<h5>' + place.name + '</h5><p>' + place.formatted_address;
          if (!!place.formatted_phone_number) contentStr += '<br>' + place.formatted_phone_number;
          //if (!!place.website) contentStr += '<br><a target="_blank" href="' + place.website + '">' + place.website + '</a>';
          //contentStr += '<br>' + place.types + '</p>';

          contentStr = '<p style="word-wrap:nospace">' + contentStr + '</p>';
          infowindow.setContent(contentStr);
          infowindow.open(map, marker);
        } else {
          var contentStr = "<h5>No Result, status=" + status + "</h5>";
          infowindow.setContent(contentStr);
          infowindow.open(map, marker);
        }
      });

    });

    gmarkers.push(marker);

  }


  google.maps.event.addListener(infowindow, "closeclick", function () {
    map.panTo(startLoc);
  });


  autocomplete.addListener('place_changed', function () {
    p_infowindow.close();
    //p_marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }




    // If the place has a geometry, then present it on a map.
    var bName = place.name;
    var bAddress = place.formatted_address;
    var bAddressFinal = bAddress.split(",")
    var streetAddress = bAddressFinal[0]

    var idToCheck = 'A' + streetAddress.split(' ').join('_');
    if (null == rowMarkerMap[idToCheck]) {
      goldStar.fillColor = 'black';
      var placeMarker = new google.maps.Marker({
        map: map,
        icon: goldStar,
        position: place.geometry.location
      });
      rowMarkerMap[idToCheck] = placeMarker;
      createTableRows(bName, streetAddress, 'black', 2);

      d3.select('#' + 'B' + streetAddress.split(' ').join('_')).transition().duration(10)
        .style('fill', 'black')
        .style('fill-opacity', 1.0);

      var firstElement = document.getElementById("groceryTableData").rows[0];
      var currRow = document.getElementById(idToCheck);

      firstElement.parentNode.insertBefore(currRow, firstElement);
    }
    else {

      var currMarker = rowMarkerMap[idToCheck];

      var currContent = rowContentMap[idToCheck];
      var currColorType = currContent.Color;

      goldStar.fillColor = currColorType;
      currMarker.setIcon(goldStar);
      currContent.Preferred = 1;
      rowContentMap[idToCheck] = currContent;

      var currRow = document.getElementById(idToCheck);
      if (null == currRow) {
        createTableRows(currContent.Name, currContent.Address, currContent.Color);
        currMarker.setVisible(true);

      }
      else {

        var firstElement = document.getElementById("groceryTableData").rows[0];
        firstElement.parentNode.insertBefore(currRow, firstElement);

      }



      var currAddr = currContent.Address;
      d3.select('#' + 'B' + currAddr.split(' ').join('_')).transition().duration(10)
        .style('fill', currColorType)
        .style('fill-opacity', 1.0);




    }

    map.panTo(place.geometry.location);

    searchBox = document.getElementById("searchInput");
    searchBox.value = "";
    //map.setZoom(2);  // Why 17? Because it looks good.

    //p_marker.setPosition(place.geometry.location);
    //p_marker.setVisible(true);


  });

}

function csHandler(event) {
  var csCheckbox = event.target;

  if (!csCheckbox.checked) {

    var csRows = storeTypeIdMap["CS"];

    for (var i = 0; i < csRows.length; i++) {
      var currContent = rowContentMap[csRows[i]];
      if (currContent.Preferred == 0) {
        var row = document.getElementById(csRows[i]);
        row.parentNode.removeChild(row);

        var currMarker = rowMarkerMap[csRows[i]];
        currMarker.setVisible(false);
      }


    }
  }
  else {

    var csRows = storeTypeIdMap["CS"];
    for (var i = 0; i < csRows.length; i++) {
      var currContent = rowContentMap[csRows[i]];
      if (currContent.Preferred == 0) {
        var currContent = rowContentMap[csRows[i]];
        var row = document.getElementById(csRows[i]);
        if (row == null)
          createTableRows(currContent.Name, currContent.Address, currContent.Color);

        var currMarker = rowMarkerMap[csRows[i]];
        currMarker.setVisible(true);
      }


    }
  }

  map.panTo(startLoc);

}

function smHandler(event) {
  var smCheckbox = event.target;

  if (!smCheckbox.checked) {

    var smRows = storeTypeIdMap["SM"];

    for (var i = 0; i < smRows.length; i++) {
      var currContent = rowContentMap[smRows[i]];
      if (currContent.Preferred == 0) {
        var row = document.getElementById(smRows[i]);
        row.parentNode.removeChild(row);

        var currMarker = rowMarkerMap[smRows[i]];
        currMarker.setVisible(false);
      }


    }
  }
  else {
    var smRows = storeTypeIdMap["SM"];

    for (var i = 0; i < smRows.length; i++) {
      var currContent = rowContentMap[smRows[i]];

      if (currContent.Preferred == 0) {
        var currContent = rowContentMap[smRows[i]];
        var row = document.getElementById(smRows[i]);
        if (row == null)
          createTableRows(currContent.Name, currContent.Address, currContent.Color);

        var currMarker = rowMarkerMap[smRows[i]];
        currMarker.setVisible(true);
      }

    }
  }

  map.panTo(startLoc);

}

function fmHandler(event) {
  var fmCheckbox = event.target;

  if (!fmCheckbox.checked) {

    var fmRows = storeTypeIdMap["FM"];

    for (var i = 0; i < fmRows.length; i++) {
      var currContent = rowContentMap[fmRows[i]];
      if (currContent.Preferred == 0) {
        var row = document.getElementById(fmRows[i]);
        row.parentNode.removeChild(row);

        var currMarker = rowMarkerMap[fmRows[i]];
        currMarker.setVisible(false);
      }
    }
  }
  else {

    var fmRows = storeTypeIdMap["FM"];

    for (var i = 0; i < fmRows.length; i++) {
      var currContent = rowContentMap[fmRows[i]];
      if (currContent.Preferred == 0) {
        var currContent = rowContentMap[fmRows[i]];
        var row = document.getElementById(fmRows[i]);
        if (row == null)
          createTableRows(currContent.Name, currContent.Address, currContent.Color);

        var currMarker = rowMarkerMap[fmRows[i]];
        currMarker.setVisible(true);
      }

    }
  }

  map.panTo(startLoc);

}

function createTableRows(businessName, streetAddr, colorType, preferredValue = 0) {
  var tableBody = document.getElementById("groceryTableData").getElementsByTagName('tbody')[0];
  var newRow = tableBody.insertRow(tableBody.rows.length);
  newRow.className = "groceryTableRow";

  // set row id
  newString = streetAddr.replace(/[^a-zA-Z0-9]/g, '_');
  var rowId = 'A' + newString.split(' ').join('_');
  newRow.setAttribute('id', rowId);

  /* Create space for star */
  var starCell = newRow.insertCell(0);
  var starDiv = document.createElement('div');
  starDiv.setAttribute('style', 'height:20px;width:20px;fill:colorType');

  /* Create empty star */
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('style', 'background-color: none');


  starCell.appendChild(starDiv);
  starDiv.appendChild(svg);

  var star = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  star.setAttribute('points', '47.6190476190476,4.76190476190476 19.047619047619,94.2857142857143 90.4761904761905,37.1428571428571 4.76190476190476,37.1428571428571 76.1904761904762,94.2857142857143');
  star.setAttribute('class', 'star');


  svg.appendChild(star);

  /* Create space for data */
  var newCell = newRow.insertCell(1);
  var bNameSpan = document.createElement('span');
  bNameSpan.textContent = businessName;
  var color_Type = 'color:' + colorType;
  bNameSpan.setAttribute('style', color_Type);
  var nLine = document.createElement("br");
  var sAddr = document.createTextNode(streetAddr);
  newCell.appendChild(bNameSpan);
  newCell.append(nLine);
  newCell.appendChild(sAddr);

  newCell.setAttribute('class', 'rowText');

  // map update
  var content = { 'Name': businessName, 'Address': streetAddr, 'Color': colorType, 'Preferred': preferredValue };
  if (rowId in rowContentMap)
    console.log(streetAddr);

  rowContentMap[rowId] = content;


  var starId = 'B' + newString.split(' ').join('_')
  star.setAttribute('id', starId);
  var starRef = d3.select('#' + 'B' + newString.split(' ').join('_'));
  starRef.on("click",
    function () {
      //console.log('hi');

      var selectedId = this.id;
      var rowId = 'A' + selectedId.slice(1);
      var currMarker = rowMarkerMap[rowId];
      var currContent = rowContentMap[rowId];
      var currColorType = currContent.Color;
      var firstElement = document.getElementById("groceryTableData").rows[0];
      var firstElementId = firstElement.id;


      if (parseFloat(d3.select(this).style('fill-opacity')) == 0.3) {
        d3.select(this).transition().duration(10)
          .style('fill', currColorType)
          .style('fill-opacity', 1.0);

        //remove current marker
        goldStar.fillColor = currColorType;
        currMarker.setIcon(goldStar);
        currContent.Preferred = 1;
        rowContentMap[rowId] = currContent;


        var currRow = document.getElementById(rowId);

        firstElement.parentNode.insertBefore(currRow, firstElement);



      } else {
        d3.select(this).transition().duration(10)
          .style('fill', '#C8C8C8')
          .style('fill-opacity', 0.3);


        if (currContent.Preferred != 2) {
          var iconToUse = CS;
          if (currColorType == '#9999ff')
            iconToUse = SM;
          else if (currColorType == '#99c199')
            iconToUse = FM;

          currMarker.setIcon(iconToUse);

          currContent.Preferred = 0;
          rowContentMap[rowId] = currContent;

          // traverse all the rows below the star row
          baseRow = document.getElementById(rowId)

          var startSwitching = false;
          var table = document.getElementById("groceryTableData");
          for (var i = 1, row; row = table.rows[i]; i++) {

            if (startSwitching) {
              if (rowContentMap[row.id].Preferred == 1)
                baseRow.parentNode.insertBefore(row, baseRow);
            }

            if (row.id == rowId)
              startSwitching = true;
          }

        }
        else {
          var row = document.getElementById(rowId)
          var markerToRemove = rowMarkerMap[rowId]
          markerToRemove.setMap(null)
          row.parentNode.removeChild(row);
          map.panTo(startLoc);

        }






      }
    }
  );

  function onRowClick(tableId, callback) {
    var table = document.getElementById(tableId),
      rows = table.getElementsByTagName("tr"),
      i;

    for (var i = 0, row; row = table.rows[i]; i++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      for (var j = 0, col; col = row.cells[j]; j++) {
        //iterate through columns
        //columns would be accessed using the "col" variable assigned in the for loop
        if (j == 1) {
          col.onclick = function (row) {
            return function () {
              callback(row);
            };
          }(table.rows[i]);
        }
      }
    }
    /*for (i = 0; i < rows.length; i++) {
        table.rows[i].onclick = function (row) {
            return function () {
                callback(row);
            };
        }(table.rows[i]);
    }*/
  };

  onRowClick("groceryTableData", function (row) {
    console.log(row.id);
    markerToShow = rowMarkerMap[row.id];
    infowindow.marker = markerToShow;

    var request = {
      reference: markerToShow.reference
    };
    service.getDetails(request, function (place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var contentStr = '<h5>' + place.name + '</h5><p>' + place.formatted_address;
        if (!!place.formatted_phone_number) contentStr += '<br>' + place.formatted_phone_number;
        //if (!!place.website) contentStr += '<br><a target="_blank" href="' + place.website + '">' + place.website + '</a>';
        //contentStr += '<br>' + place.types + '</p>';

        contentStr = '<p style="word-wrap:nospace">' + contentStr + '</p>';
        infowindow.setContent(contentStr);
        infowindow.open(map, markerToShow);
      } else {
        var contentStr = "<h5>No Result, status=" + status + "</h5>";
        infowindow.setContent(contentStr);
        infowindow.open(map, markerToShow);
      }
    });

    /* Info windo added */

  });


}


  //google.maps.event.addDomListener(window, 'load', initialize);



/* Generic create table rows for Grocery */
