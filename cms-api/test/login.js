'use strict';

// tests for app
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('app', '/src/app-serverless.js', 'handler');

const {
  eventPostRequest 
} = require('./helpers');



