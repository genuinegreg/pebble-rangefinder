/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');

var geolocId;
var currentPos;
var savedPos = JSON.parse(localStorage.getItem('savedPos'));
var prevPos = savedPos;

var GpsUtils = require('./GpsUtils.js');


startGeolocation();


var main = new UI.Card({
  title: 'Range finder',
  //   icon: 'images/menu_icon.png',
  subtitle: !savedPos ? 'press select' : '',
  //   body: 'Down => history, Up =S save',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'up', function(e) {
  if (geolocId) {
    stopGeolocation();
    main.subtitle('stoped');
    return;
  }

  startGeolocation();
  main.subtitle('started');
});


main.on('click', 'select', function(e) {
  savedPos = currentPos;
  localStorage.setItem('savedPos',  JSON.stringify(savedPos));
});


var latency = 0;
setInterval(function() {
  latency = Math.floor((currentPos.timestamp - prevPos.timestamp)/1000);

  //    + (latency > 1 ? "\n" + (currentPos.timestamp - prevPos.timestamp) / 1000 + 's ago' : ''


  main.body('+-' + Math.floor(currentPos.accuracy) + "m" + (latency > 1 ? "\n" + latency + 's ago' : ''));
}, 1000);

function startGeolocation() {
  if (geolocId) {
    return;
  }

  geolocId = navigator.geolocation.watchPosition(
    function success(pos) {

      prevPos = currentPos;

      currentPos = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp
      };

      if (savedPos) {
        console.log('distance', GpsUtils.distance(savedPos, currentPos));
        console.log(GpsUtils.distance(savedPos, currentPos));
        main.subtitle(Math.floor(GpsUtils.distance(savedPos, currentPos)*1000) + 'm');
      }
    },
    function error(err) {
      console.error('error geolocation', err)          ;                     
    }, 
    {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 2000
    });
}

function stopGeolocation() {
  navigator.geolocation.clearWatch(geolocId);
  geolocId = undefined;
}