'use strict';

var Book = require('../models/bookModel');


module.exports = function (router) {
    router.get('/', ensureAuthenticated, function (req, res) { 
        Book.find({}, function(err, books){
            if(err){
                console.log(err);
            } 
    
            books.forEach(function(book){
                book.truncText = book.truncText(50);
            });
    
            var model = {
                books: books
            }
            res.render('index', model);
        });
    });

    function ensureAuthenticated(req, res, next) {
        if(req.isAuthenticated()) {
          return next();
        } 
        res.redirect('/users/login');
      }

};
