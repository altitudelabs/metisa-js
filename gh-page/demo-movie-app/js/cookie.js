var returnHash = function() {
  abc = "abcdef1234567890".split("");
  var token="";
  for(i=0;i<32;i++){
       token += abc[Math.floor(Math.random()*abc.length)];
  }
  return token; // Will return a 32 bit "hash"
}

var createSessionCookie = function() {
  value = returnHash();
  var expires = "";
  document.cookie = "MetisaTracking=" + value + expires + "; path=/";
}

var readSessionCookie = function() {
    var nameEQ = "MetisaTracking" + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var createCookie = function(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

var readCookie = function(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

var eraseCookie = function(name) {
    createCookie(name, "", -1);
}