'use strict';

var express = require('express');
var kraken = require('kraken-js');
var flash = require('connect-flash');
var db =  require('./lib/db');
var path = require('path');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
require('dotenv').config()


var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        db.config(config.get('dbConfig'));
        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));

// Connect-Flash
// app.use(flash());
// app.use(function (req, res, next) {
//     res.locals.messages = require('express-messages')(req, res);
//     next();
// });
app.use(session({
    secret : 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator())
app.use(flash());
app.use(function (req, res, next) {
    var messages = require('express-messages')(req, res);
    res.locals.messages = function (chunk, context, bodies, params) {
        return chunk.write(messages());
    };
    next();
});

app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});
