"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var counter = 0;
var last = null;

exports.default = function () {
  var now = parseInt(Date.now()) * 1000;

  if (now !== last) {
    counter = 0;
  }

  if (counter < 999) {
    counter++;
  }

  return (last = now) + counter;
};