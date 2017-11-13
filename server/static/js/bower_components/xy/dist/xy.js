(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Xy = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
// Xy.js
// (c) 2013-2014 thunder9 (https://github.com/thunder9)
// Xy may be freely distributed under the MIT license.

'use strict';

var Transform = require('./transform');

function Xy(ctx, opts) {
  this.ctx = ctx;

  function ctor(opts) {
    for (var prop in opts) this[prop] = opts[prop];
  }
  ctor.prototype = Xy.defaults;
  this.options = new ctor(opts);

  this.width = this.options.width || ctx.canvas.width;
  this.height = this.options.height || ctx.canvas.height;

  var computedStyle = window.getComputedStyle(ctx.canvas);
  if (computedStyle.width === 'auto') ctx.canvas.style.width = this.width + 'px';
  if (computedStyle.height === 'auto') ctx.canvas.style.height = this.height + 'px';

  var pixcelRatio = window.devicePixelRatio || 1;
  ctx.canvas.width = this.width * pixcelRatio;
  ctx.canvas.height = this.height * pixcelRatio;
  ctx.scale(pixcelRatio, pixcelRatio);
}

Xy.prototype.draw = function(datasets, update) {

  var ctx = this.ctx;
  var opts = this.options;

  if (!this.ticksX || !this.ticksY || update) updateChart.call(this, datasets);

  ctx.clearRect(0, 0, this.width, this.height);

  this.before();

  if (opts.grid) {
    ctx.strokeStyle = opts.gridColor;
    ctx.lineWidth = opts.gridWidth;
    this.drawXGrids(this.ticksX, this.rangeY);
    this.drawYGrids(this.ticksY, this.rangeX);
  }

  if (opts.scale) {
    ctx.strokeStyle = opts.scaleColor;
    ctx.lineWidth = opts.scaleWidth;
    this.drawXScale(this.rangeX, this.ticksX, this.rangeY[0]);
    this.drawYScale(this.rangeY, this.ticksY, this.rangeX[0]);
  }

  if (opts.label) {
    ctx.fillStyle = opts.labelColor;

    ctx.save();
    ctx.translate(0, this.padding);
    this.drawXLabels(this.ticksX, this.rangeY[0], this.labelSizeX.rot);
    ctx.restore();

    ctx.save();
    ctx.translate(-this.padding, 0);
    this.drawYLabels(this.ticksY, this.rangeX[0]);
    ctx.restore();
  }

  ctx.save();

  ctx.beginPath();
  ctx.xywhr.rect(this.rangeX[0] - this.pointRadiusX, this.rangeY[0] - this.pointRadiusY, this.lengthX + this.pointRadiusX * 2, this.lengthY + this.pointRadiusY * 2);
  ctx.clip();

  if (opts.line) {
    ctx.lineWidth = opts.lineWidth;
    this.drawLines(datasets);
  }

  if (opts.point) {
    ctx.lineWidth = opts.pointStrokeWidth;
    this.drawPoints(datasets);
  }

  this.plot(datasets);

  ctx.restore();

  this.after();
};

Xy.prototype.measureLabelSizeX = function(ticks, fontSize, width) {
  var ctx = this.ctx;
  var widest = 0;
  for (var i = 0; i < ticks.length; i++) {
    var measured = ctx.measureText(this.formatXLabel(ticks[i]));
    if (measured.width > widest) widest = measured.width;
  }
  var size = {
    width: widest,
    height: fontSize,
    rot: 0
  };

  if (!width) return size;

  var hop = width / ticks.length;
  if (size.width > hop) {
    size.rot = Math.PI / 4;
    var a = Math.cos(size.rot);
    size.width = widest * a;
    size.height = size.width + fontSize * a;
    if (size.width > hop) {
      size.rot = Math.PI / 2;
      size.width = fontSize;
      size.height = widest;
    }
  }

  return size;
};

Xy.prototype.measureLabelSizeY = function(ticks, fontSize) {
  var ctx = this.ctx;
  var widest = 1;
  for (var i = 0; i < ticks.length; i++) {
    var size = ctx.measureText(this.formatYLabel(ticks[i]));
    if (size.width > widest) widest = size.width;
  }

  return {
    width: widest,
    height: fontSize
  };
};

Xy.prototype.drawXGrids = function(ticks, rangeY) {
  var ctx = this.ctx;
  for (var i = 0; i < ticks.length; i++) {
    ctx.beginPath();
    ctx.xy.moveTo(ticks[i], rangeY[0]);
    ctx.xy.lineTo(ticks[i], rangeY[1]);
    ctx.stroke();
  }
};

Xy.prototype.drawYGrids = function(ticks, rangeX) {
  var ctx = this.ctx;
  for (var i = 0; i < ticks.length; i++) {
    ctx.beginPath();
    ctx.xy.moveTo(rangeX[0], ticks[i]);
    ctx.xy.lineTo(rangeX[1], ticks[i]);
    ctx.stroke();
  }
};

Xy.prototype.drawXScale = function(rangeX, ticks, y) {
  var ctx = this.ctx;
  ctx.beginPath();
  ctx.xy.moveTo(rangeX[0], y);
  ctx.xy.lineTo(rangeX[1], y);
  ctx.stroke();
};

Xy.prototype.drawYScale = function(rangeY, ticks, x) {
  var ctx = this.ctx;
  ctx.beginPath();
  ctx.xy.moveTo(x, rangeY[0]);
  ctx.xy.lineTo(x, rangeY[1]);
  ctx.stroke();
};

Xy.prototype.drawXLabels = function(ticks, y, rot) {
  var ctx = this.ctx;

  if (rot === 0) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    for (var i = 0; i < ticks.length; i++) {
      ctx.xy.fillText(this.formatXLabel(ticks[i]), ticks[i], y);
    }
  } else {
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    if (rot === Math.PI / 4) ctx.translate(0, this.options.labelFontSize * 0.3);

    for (var i = 0; i < ticks.length; i++) {
      ctx.save();

      ctx.xy.translate(ticks[i], y);
      ctx.rotate(-rot);
      ctx.fillText(this.formatXLabel(ticks[i]), 0, 0);

      ctx.restore();
    }
  }
};

Xy.prototype.drawYLabels = function(ticks, x) {
  var ctx = this.ctx;

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';

  for (var i = 0; i < ticks.length; i++) ctx.xy.fillText(this.formatYLabel(ticks[i]), x, ticks[i]);
};

Xy.prototype.formatXLabel = function(value) {
  return value;
};

Xy.prototype.formatYLabel = function(value) {
  return value;
};

Xy.prototype.drawLines = function(datasets) {
  var ctx = this.ctx;
  var smooth = this.options.smooth;
  var lengthX = this.rangeX[1] - this.rangeX[0];
  var lengthY = this.rangeY[1] - this.rangeY[0];

  for (var i = 0; i < datasets.length; i++) {

    ctx.strokeStyle = datasets[i].lineColor;
    var data = datasets[i].data;

    ctx.beginPath();

    if (data.length > 0) ctx.xy.moveTo(data[0][0], data[0][1]);

    if (smooth && data.length > 2) {
      var point = null;
      var points = [];

      for (var j = 0; j < data.length; j++) {
        var newPoint = {
          x: data[j][0] / lengthX,
          y: data[j][1] / lengthY,
          prev: point
        }
        point = newPoint;
        points[j] = point;

        if (point.prev && point.prev.prev) computeControlPoints(point, smooth);
      }

      for (var j = 1; j < points.length; j++) {
        var point = points[j];

        if (point.cp1x && point.cp2x) {
          ctx.nxy.bezierCurveTo(point.cp1x, point.cp1y, point.cp2x, point.cp2y, point.x, point.y);
        } else if (point.cp1x) {
          ctx.nxy.quadraticCurveTo(point.cp1x, point.cp1y, point.x, point.y);
        } else {
          ctx.nxy.quadraticCurveTo(point.cp2x, point.cp2y, point.x, point.y);
        }
      }
    }

    else for (var j = 1; j < data.length; j++) ctx.xy.lineTo(data[j][0], data[j][1]);

    ctx.stroke();
  }
};

Xy.prototype.drawPoints = function(datasets) {
  var ctx = this.ctx;
  var radius = this.options.pointCircleRadius;

  for (var i = 0; i < datasets.length; i++) {
    ctx.fillStyle = datasets[i].pointColor;
    ctx.strokeStyle = datasets[i].pointStrokeColor;

    var data = datasets[i].data;

    for (var j = 0; j < data.length; j++) {
      ctx.beginPath();
      ctx.xy.arc(data[j][0], data[j][1], radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }
};

Xy.prototype.plot = function(datasets) {};

Xy.prototype.before = function() {};

Xy.prototype.after = function() {};

Xy.prototype.hitTest = function(datasets, x, y) {
  var ctx = this.ctx;
  var radius = this.options.pointCircleRadius;

  var intersected = [];

  ctx.save();

  for (var i = 0; i < datasets.length; i++) {
    var data = datasets[i].data;

    for (var j = 0; j < data.length; j++) {
      ctx.beginPath();
      ctx.xy.arc(data[j][0], data[j][1], radius, 0, 2 * Math.PI);
      ctx.closePath();

      if (ctx.isPointInPath(x, y)) {
        intersected.push({
          datapointIndex: i,
          dataIndex: j,
          data: data[j]
        });
      }
    }
  }

  ctx.restore();

  return intersected;
};

function updateChart(datasets) {

  var ctx = this.ctx;
  var opts = this.options;

  ctx.font = opts.labelFontStyle + ' ' + opts.labelFontSize + "px '" + opts.labelFontName + "'";

  this.ticksX = createTicksX(this, datasets);
  this.ticksY = createTicksY(this, datasets);

  var rangeX = this.rangeX = [];
  var rangeY = this.rangeY = [];
  rangeX[0] = opts.rangeX[0] === 'auto' ? this.ticksX[0] : +opts.rangeX[0];
  rangeX[1] = opts.rangeX[1] === 'auto' ? this.ticksX[Math.max(this.ticksX.length - 1, 0)] : +opts.rangeX[1];
  rangeY[0] = opts.rangeY[0] === 'auto' ? this.ticksY[0] : +opts.rangeY[0];
  rangeY[1] = opts.rangeY[1] === 'auto' ? this.ticksY[Math.max(this.ticksY.length - 1, 0)] : +opts.rangeY[1];

  var pointRadius = opts.pointCircleRadius + opts.pointStrokeWidth / 2;
  var padding = this.padding = Math.max(opts.labelFontSize / 2, pointRadius);

  var width = this.width;
  var height = this.height;

  var labelSizeY = this.labelSizeY = this.measureLabelSizeY(this.ticksY, opts.labelFontSize);
  var offsetX = labelSizeY.width + padding;

  var labelSizeX = this.labelSizeX = this.measureLabelSizeX(this.ticksX, opts.labelFontSize, width - offsetX);
  var offsetY = labelSizeX.height + padding;

  offsetX = Math.max(offsetX, labelSizeX.rot === Math.PI / 4 ? labelSizeX.width : labelSizeX.width / 2);

  var lengthX = this.lengthX = rangeX[1] - rangeX[0];
  var lengthY = this.lengthY = rangeY[1] - rangeY[0];

  var paddingX = Math.max(padding, labelSizeX.rot === Math.PI / 4  ? 0 : labelSizeX.width / 2);

  var scalingX = lengthX > 0 ? (width - offsetX - paddingX) / lengthX : 1;
  var scalingY = lengthY > 0 ? (height - offsetY - padding) / lengthY : 1;

  this.pointRadiusX = pointRadius / scalingX;
  this.pointRadiusY = pointRadius / scalingY;

  (function() {

    function transformX(x, length) { return (x * length - rangeX[0]) * scalingX + offsetX; }
    function transformY(y, length) { return (rangeY[0] - y * length) * scalingY + height - offsetY; }
    function scaleX(x, length) { return x * length * scalingX; }
    function scaleY(y, length) { return -y * length * scalingY; }

    ctx.xy = new Transform(ctx, {
      x: curry2(transformX)(1),
      y: curry2(transformY)(1)
    });

    ctx.xywhr = new Transform(ctx, {
      x: curry2(transformX)(1),
      y: curry2(transformY)(1),
      width: curry2(scaleX)(1),
      height: curry2(scaleY)(1),
      radius: opts.scalingRadius === 'y' ? curry2(scaleY)(-1) : curry2(scaleX)(1)
    });

    ctx.nxy = new Transform(ctx, {
      x: curry2(transformX)(lengthX),
      y: curry2(transformY)(lengthY)
    });

    ctx.nxywhr = new Transform(ctx, {
      x: curry2(transformX)(lengthX),
      y: curry2(transformY)(lengthY),
      width: curry2(scaleX)(lengthX),
      height: curry2(scaleY)(lengthY),
      radius: opts.scalingRadius === 'y' ? curry2(scaleY)(-lengthY) : curry2(scaleX)(lengthX)
    });
  })();
}

function curry2(fun) {
  return function(secondArg) {
    return function(firstArg) {
      return fun(firstArg, secondArg);
    };
  };
}

function createTicksX(xy, datasets) {

  var parameters = setupScalePrameters({
    lower: xy.options.rangeX[0],
    upper: xy.options.rangeX[1],
    incr: xy.options.tickStepX
  }, datasets, 0, function(ticks) {
    var size = xy.measureLabelSizeX(ticks, xy.options.labelFontSize);
    return {
      offset: size.height,
      hop: size.width
    };
  }, xy.width);

  return generateTicks(parameters.lower, parameters.upper, parameters.incr, xy.width);
};

function createTicksY(xy, datasets) {

  var parameters = setupScalePrameters({
    lower: xy.options.rangeY[0],
    upper: xy.options.rangeY[1],
    incr: xy.options.tickStepY
  }, datasets, 1, function(ticks) {
    var size = xy.measureLabelSizeY(ticks, xy.options.labelFontSize);
    return {
      offset: size.width,
      hop: size.height
    };
  }, xy.height);

  return generateTicks(parameters.lower, parameters.upper, parameters.incr, xy.height);
}

var roundingDigitsParser = /0*$|\.\d*|e[+-]\d+/;

function generateTicks(lower, upper, incr, limit) {

  // Get a base 10 exponent for separating "significant" integer part from tick values based on given `incr` with text-based analysis.
  var roundingDigits = roundingDigitsParser.exec(incr)[0];
  var exponent = /e/.test(roundingDigits)
    ? -roundingDigits.substring(1) : /\./.test(roundingDigits) ? roundingDigits.length - 1 : -roundingDigits.length;

  var ticks = [];
  var i = 0;
  var t;
  lower = incr * Math.ceil(lower / incr);
  while ((t = round(lower + i * incr, exponent)) <= upper && i < (limit || Infinity)) ticks[i++] = t;
  return ticks;
}

// Round value based on given base 10 `exponent`.
// This operation will be need for preventing an unexpected decimal value due to the internal format of binary floating point.
function round(v, exponent) {
  var significantPart = Math.abs(v) * Math.pow(10, exponent);
  var precision = significantPart < 1e21 ? significantPart.toFixed().length : 21;
  return +v.toPrecision(precision);
}

function setupScalePrameters(parameters, datasets, dim, measureFun, canvasSize) {
  var lower, upper;

  if (parameters.lower === 'auto' || parameters.upper === 'auto') {
    lower = Number.MAX_VALUE;
    upper = Number.MIN_VALUE;
    for (var i = 0; i < datasets.length; i++) {
      var data = datasets[i].data;
      for (var j = 0; j < data.length; j++) {
        if (data[j][dim] > upper) upper = data[j][dim];
        if (data[j][dim] < lower) lower = data[j][dim];
      }
    }
  }

  if (parameters.lower !== 'auto') lower = parameters.lower;
  if (parameters.upper !== 'auto') upper = parameters.upper;

  if (parameters.incr === 'auto') {
    parameters.incr = quantizeTics(upper - lower, 1);
    for (var numberOfTicks = 2; numberOfTicks < canvasSize; numberOfTicks++) {
      var incr = quantizeTics(upper - lower, numberOfTicks);
      var labelSize = measureFun(generateTicks(lower, upper, incr));
      if (canvasSize / (labelSize.hop * 1.5) < numberOfTicks) break;
      parameters.incr = incr;
    }
  }

  if (parameters.lower === 'auto') {
    parameters.lower = parameters.incr * Math.floor(lower / parameters.incr);
  }

  if (parameters.upper === 'auto') {
    parameters.upper = parameters.incr * Math.ceil(upper / parameters.incr);
  }

  return parameters;
}

var tickNumbers = [10, 5, 2];

function quantizeTics(range, numberOfTicks) {
  var order = Math.floor(Math.log(range) * Math.LOG10E);
  var incr = 0;

  for (; range > 0 && numberOfTicks > 0; order--) {
    for (var i = 0; i < tickNumbers.length; i++) {
      var test = Math.pow(10, order) * tickNumbers[i];
      if (range / test > numberOfTicks) return +incr.toPrecision(1);
      incr = test;
    }
  }

  return incr;
}

// A casual smoothing.
function computeControlPoints(point, smooth) {
  var vx = point.x - point.prev.prev.x;
  var vy = point.y - point.prev.prev.y;
  var vn = vx * vx + vy * vy;
  var d1 = distance2(point, point.prev);
  var d2 = distance2(point.prev, point.prev.prev);
  var a;

  a = d2 > 0 ? Math.sqrt(d2 / vn) * smooth : Math.sqrt(d1 / vn) * smooth;
  point.prev.cp2x = point.prev.x - vx * a;
  point.prev.cp2y = point.prev.y - vy * a;

  a = Math.sqrt(d1 / vn) * smooth;
  point.cp1x = point.prev.x + vx * a;
  point.cp1y = point.prev.y + vy * a;
}

function distance2(p1, p2) {
  var dx = p1.x - p2.x;
  var dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

var hasProp = {}.hasOwnProperty;

// Extend a given object with all the properties in passed-in object(s).
// Based on the Underscore's `extend` function.
function extend(obj) {
  var source, prop;
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i];
    for (prop in source) {
      if (hasProp.call(source, prop)) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
};

// Helper function to correctly set up the prototype chain, for subclasses.
// Based on the Backbone's `extend` helper.
Xy.extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  if (protoProps && hasProp.call(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  extend(child, parent, staticProps);

  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  if (protoProps) extend(child.prototype, protoProps);

  child.__super__ = parent.prototype;

  return child;
};

Xy.defaults = {

  rangeX: ['auto', 'auto'],
  rangeY: ['auto', 'auto'],
  tickStepX: 'auto',
  tickStepY: 'auto',

  scale: true,
  scaleColor: 'rgba(0,0,0,.1)',
  scaleWidth: 1,

  grid: true,
  gridColor: 'rgba(0,0,0,.05)',
  gridWidth: 1,

  label: true,
  labelFontName: 'Arial',
  labelFontSize: 20,
  labelFontStyle: 'normal',
  labelColor: '#666',

  point: true,
  pointCircleRadius: 8,
  pointStrokeWidth: 4,

  line: true,
  lineWidth: 4,

  smooth: 0.3,

  scalingRadius: 'x'
};

module.exports = Xy;

},{"./transform":1}]},{},[2,1])(2)
});