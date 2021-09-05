'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/userModel');
var Book = require('../models/bookModel');

module.exports = function(router) {
    router.get('/', function(req, res, next) {
        res.render('users/index');
    });
      
    router.get('/register', function(req, res, next) {
        res.render('users/register', {title:'Register'});
    });
      
    router.get('/login', function(req, res, next) {
        res.render('users/login', {title:'Login'});
    });
      
    router.post('/login',
        passport.authenticate('local', {failureRedirect :'/users/login', failureFlash:'Invalid username or password'}),
        function(req, res) {
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
                req.flash('success', 'you are now logged in');
                res.render('index', model);
            });
        });
      
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        
        passport.deserializeUser(function(id, done) {
            User.getUserById(id, function(err, user) {
                done(err, user);
            });
        });
      
        passport.use(new LocalStrategy(function(username,password,done){
            User.getUserByUsername(username, function(err, user){
                if(err) throw err;
                if(!user){
                return done(null, false, {message:'unknown user'});
            }
      
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw done(err);
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message:'password is incorrect'});
                }
            });
            });
        }));
      
    router.post('/register', function(req, res, next) {
        var name = req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;
      
        req.checkBody('name', 'Name field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username field is required').notEmpty();
        req.checkBody('password', 'Password field is required').notEmpty();
        req.checkBody('password2', 'Password do not match').equals(req.body.password);
        
        var errors = req.validationErrors();
      
        if(errors){
            req.flash('error', 'Please fill required fields');
            res.location('/users/register');
            res.redirect('/users/register');
        } else {
            var newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password
            });

            console.log(newUser);
            User.createUser(newUser, function(err, user){
                if(err) throw err
               console.log((user));
            });
      
            req.flash('success', 'You are now registred and can login');
      
            res.location('/users/login');
            res.redirect('/users/login');
        }
    });
      
    router.get('/logout', function(req, res) {
        req.logout();
        req.flash('success', ' you are now logged out');
        res.redirect('/users/login');
    });
    
}
