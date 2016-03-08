'use strict';

var express = require('express');
var router = express.Router();
var warroom = require('../warroom-client');

var avgArr = [];
var WOPRcount = [];
var HALcount = [];
var R2count = [];

// GET '/' streams all three servers data
router.get('/', function(req, res, next) {
  warroom(function(err, data) {
    trackData(data.data);
    res.json(data.data);
  });
});

function trackData(data) {
  if (avgArr.length > 1000) {
    avgArr.splice(0, 100);
    WOPRcount.splice(0, 100);
    HALcount.splice(0, 100);
    R2count.splice(0, 100);
  }
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === 'WOPR') {
      WOPRcount.push(data[i].responseTime);
      data[i].avgResponse = getAvg(WOPRcount);
    } else if (data[i].name === 'HAL') {
      HALcount.push(data[i].responseTime);
      data[i].avgResponse = getAvg(HALcount);
    } else {
      R2count.push(data[i].responseTime);
      data[i].avgResponse = getAvg(R2count);
    }
  }
  avgArr.push(data);
}

function getAvg(arr) {
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  var avg = total / arr.length;
  return avg;
}

router.get('/data', function(req, res, next) {
  res.json(avgArr.shift());
});

module.exports = router;
