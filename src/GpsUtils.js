var R = 6371; // km

function GpsUtils() {

}

GpsUtils.prototype.toRad  = function(number) {
  return number * Math.PI / 180;
};

GpsUtils.prototype.distance = function(p1, p2) {

  //has a problem with the .toRad() method below.
  var x1 = p2.latitude - p1.latitude;
  var dLat = this.toRad(x1);
  var x2 = p2.longitude - p1.longitude;
  var dLon = this.toRad(x2);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(p1.latitude)) * Math.cos(this.toRad(p2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d;
};


module.exports = new GpsUtils();