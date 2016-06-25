"use strict";
var addEvent = function (object, type, callback) {
    if (object == null || typeof (object) == 'undefined')
        return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    }
    else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    }
    else {
        object["on" + type] = callback;
    }
};
function windowResize() {
}
addEvent(window, "resize", windowResize);
var app = document.querySelector('#app');
app.addEventListener('dom-change', function () {
    console.log('app ready event!');
});
window.addEventListener('polymer-ready', function (e) {
    console.log('polymer-ready event!');
});
