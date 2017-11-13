(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Transform = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Transform.js
// (c) 2013 thunder9 (https://github.com/thunder9)
// Transform may be freely distributed under the MIT license.

'use strict';

var identity = function(v) { return v; };

function Transform(ctx, funs, proxy) {
  this.native = ctx;

  if (proxy) {
    var slice = Array.prototype.slice;

    for (var prop in ctx) {
      var fun = ctx[prop];
      if (typeof fun === 'function') {
        (function(self, fun) {
          self[prop] = function() {
            var args = slice.call(arguments);
            return fun.apply(ctx, args);
          }
        })(this, fun);
      }
    }
  }

  var __x = funs.x || identity;
  var __y = funs.y || identity;
  var __w = funs.width || identity;
  var __h = funs.height || identity;
  var __r = funs.radius || identity;

  this.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
    ctx.arc(__x(x), __y(y), __r(radius), startAngle, endAngle, anticlockwise);
  };

  this.arcTo = function(x1, y1, x2, y2, radius) {
    ctx.arcTo(__x(x1), __y(y1), __x(x2), __y(y2), __r(radius));
  };

  this.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    ctx.bezierCurveTo(__x(cp1x), __y(cp1y), __x(cp2x), __y(cp2y), __x(x), __y(y));
  };

  this.clearRect = function(x, y, width, height) {
    ctx.clearRect(__x(x), __y(y), __w(width), __h(height));
  };

  this.createImageData = function(width, height) {
    return ctx.createImageData(__w(width), __h(height));
  };

  this.createLinearGradient = function(x0, y0, x1, y1) {
    return ctx.createLinearGradient(__x(x0), __y(y0), __x(x1), __y(y1));
  };

  this.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
    return ctx.createRadialGradient(__x(x0), __y(y0), __r(r0), __x(x1), __y(y1), __r(r1));
  };

  this.drawImage = function(image, x, y, w, h, dx, dy, dw, dh) {
    if (arguments.length === 3) ctx.drawImage(image, __x(x), __y(y));
    else if (arguments.length === 5) ctx.drawImage(image, __x(x), __y(y), __w(w), __h(h));
    else ctx.drawImage(image, x, y, w, h, __x(dx), __y(dy), __w(dw), __h(dh));
  };

  this.fillRect = function(x, y, width, height) {
    ctx.fillRect(__x(x), __y(y), __w(width), __h(height));
  };

  this.fillText = function(text, x, y, maxWidth) {
    if (arguments.length === 4) ctx.fillText(text, __x(x), __y(y), maxWidth);
    else ctx.fillText(text, __x(x), __y(y));
  };

  this.getImageData = function(sx, sy, sw, sh) {
    return ctx.getImageData(__x(sx), __y(sy), __w(sw), __h(sh));
  };

  this.isPointInPath = function(x, y) {
    return ctx.isPointInPath(__x(x), __y(y));
  };

  this.lineTo = function(x, y) {
    ctx.lineTo(__x(x), __y(y));
  };

  this.moveTo = function(x, y) {
    ctx.moveTo(__x(x), __y(y));
  };

  this.putImageData = function(imagedata, dx, dy, sx, sy, sw, sh) {
    ctx.putImageData(imagedata, __x(dx), __y(dy), sx, sy, sw, sh);
  };

  this.quadraticCurveTo = function(cpx, cpy, x, y) {
    ctx.quadraticCurveTo(__x(cpx), __y(cpy), __x(x), __y(y));
  };

  this.rect = function(x, y, w, h) {
    ctx.rect(__x(x), __y(y), __w(w), __h(h));
  };

  this.strokeRect = function(x, y, w, h) {
    ctx.strokeRect(__x(x), __y(y), __w(w), __h(h));
  };

  this.strokeText = function(text, x, y, maxWidth) {
    if (arguments.length === 4) ctx.strokeText(text, __x(x), __y(y), maxWidth);
    else ctx.strokeText(text, __x(x), __y(y));
  };

  this.translate = function(x, y) {
    ctx.translate(__x(x), __y(y));
  };
}

module.exports = Transform;


},{}]},{},[1])(1)
});