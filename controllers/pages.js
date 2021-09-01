'use strict';

const { route } = require("..");

module.exports = function(router) {
    router.get('/about', function(req, res) {
        res.render('pages/about');
    });
}