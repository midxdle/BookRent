'use strict';

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');
var Rent = require('../models/rentModel');
var User = require('../models/userModel');
var password = process.env.PASSWORD;

module.exports = function(router){
    router.get('/', function(req, res) {
        User.findOne({}, function(err, user) {
            if(err) {
                console.log(err);
            } 
            if(user.password == password) {
                Rent.find({}, function(err, rents){
                    if(err){
                        console.log(err);
                    }
        
                    var model = {
                        rents: rents
                    }
                    res.render('manage/index', model);
                });
            } else {
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
                    req.flash('error', 'Only admin is allowed to manage');
                    res.render('index', model);
                });
            }
        });
    });

    router.post('/return/:id', function(req, res) {
            Rent.findOne({_id : req.params.id}, function(err, rent) {
                if(err) {
                    console.log(err);
                }
                if(rent.qty == 10){
                    var newBook = Book({
                        _id : rent._id,
                        title : rent.title,
                        description : rent.description,
                        category : rent.category,
                        author : rent.author,
                        publisher : rent.publisher,
                        price : rent.price,
                        qty : 1,
                        cover : rent.cover
                    });
                    newBook.save(function(err) {
                        if(err) {
                            console.log('save error', err);
                        }
                    });

                    if(rent.qty == 1){
                        Rent.remove({_id: req.params.id}, function(err) {
                            if(err) {
                                console.log(err);
                            }
                        });
    
                    } else {
                        Rent.updateOne({_id: req.params.id}, {
                            qty : rent.qty - 1
                        },function(err) {
                            if(err) {
                                console.log(err);
                            }
                        });
    
                    }
                    
                    req.flash('success', "Book Returned");
                    res.location('/manage');
                    res.redirect('/manage');
                } else {
                    Book.updateOne({_id: req.params.id}, {
                        qty : 11 - rent.qty
                    }, function(err) {
                        if(err) {
                            console.log(err);
                        }
                });

                if(rent.qty == 1){
                    Rent.remove({_id: req.params.id}, function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });

                } else {
                    Rent.updateOne({_id: req.params.id}, {
                        qty : rent.qty - 1
                    },function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });

                }
                
                req.flash('success', "Book Returned");
                res.location('/manage');
                res.redirect('/manage');
            }
                
            });
        });

    router.get('/books', function(req, res) {
        Book.find({}, function(err, books){
            if(err){
                console.log(err);
            }

            var model = {
                books: books
            }

            res.render('manage/books/index', model);
        });
    });

    router.get('/books/add', function(req, res) {
        Category.find({}, function(err, categories){
            if(err){
                console.log(err);
            }

            var model = {
                categories: categories
            }

            res.render('manage/books/add', model);
        });
    });

    router.post('/books', function(req, res){
        var title = req.body.title && req.body.title.trim();
        var category = req.body.category && req.body.category.trim();
        var author = req.body.author && req.body.author.trim();
        var publisher = req.body.publisher && req.body.publisher.trim();
        var price = req.body.price && req.body.price.trim();
        var qty = req.body.qty && req.body.qty.trim();
        var description = req.body.description && req.body.description.trim();
        var cover = req.body.cover && req.body.cover.trim();

        if(title == '' || price == '' || qty==0){
            req.flash('error', "Please fill out required fields");
            res.location('/manage/books/add');
            res.redirect('/manage/books/add');
        }

        else if (isNaN(price)){
            req.flash('error', "Price must be a number");
            res.location('/manage/books/add');
            res.redirect('/manage/books/add');
        }

        else { 
            var newBook = new Book({
            title : title,
            category : category,
            description : description,
            author : author,
            publisher : publisher,
            cover : cover,
            price : price,
            qty : qty
        });

        newBook.save(function(err) {
            if(err) {
                console.log('save error', err);
            }

            req.flash('success', "Book Added");
            res.location('/manage/books');
            res.redirect('/manage/books');
        });
    }
    });

    router.get('/books/edit/:id', function(req, res) {
        Category.find({}, function(err, categories) {
            Book.findOne({_id:req.params.id}, function(err, book) {
                if(err) {
                    console.log(err);
                }
                var model = {
                    book: book,
                    categories: categories
                };
                res.render('manage/books/edit', model);
            });
        });
    });

    router.post('/books/edit/:id', function(req, res){
        var title = req.body.title && req.body.title.trim();
        var category = req.body.category && req.body.category.trim();
        var author = req.body.author && req.body.author.trim();
        var publisher = req.body.publisher && req.body.publisher.trim();
        var price = req.body.price && req.body.price.trim();
        var qty = req.body.qty && req.body.qty.trim();
        var description = req.body.description && req.body.description.trim();
        var cover = req.body.cover && req.body.cover.trim();

        Book.update({_id: req.params.id}, {
            title:title,
            category: category,
            author: author,
            publisher: publisher,
            price: price,
            qty : qty,
            description: description,
            cover: cover

        }, function(err) {
            if(err) {
                console.log('update error', err);
            }

            
            req.flash('success', "Book Updated");
            res.location('/manage/books');
            res.redirect('/manage/books');
        });
    });

    router.post('/books/delete/:id', function(req, res) {
        Book.remove({_id: req.params.id}, function(err) {
            if(err) {
                console.log(err);
            }
            req.flash('success', "Book Deleted");
            res.location('/manage/books');
            res.redirect('/manage/books');
        });
    });

    router.get('/categories', function(req, res) {
        Category.find({}, function(err, categories) {
            if(err) {
                console.log(err);
            }

            var model = {
                categories: categories
            };

            res.render('manage/categories/index', model);
        })
        
    });

    router.get('/categories/add', function(req, res) {
            res.render('manage/categories/add');
        });

    router.post('/categories', function(req, res){
        var name = req.body.name && req.body.name.trim();
        
        if(name == ''){
            req.flash('error', "Please fill out required fields");
            res.location('/manage/categories/add');
            res.redirect('/manage/categories/add');
        }

        else { 
            var newCategory = new Category({
            name : name
        });

        newCategory.save(function(err) {
            if(err) {
                console.log('save error', err);
            }

            req.flash('success', "Category Added");
            res.location('/manage/categories');
            res.redirect('/manage/categories');
        });
    }
    });

    router.get('/categories/edit/:id', function(req, res) {
            Category.findOne({_id:req.params.id}, function(err, category) {
                if(err) {
                    console.log(err);
                }
                var model = {
                    category: category
                };
                res.render('manage/categories/edit', model);
            });
    });

    router.post('/categories/edit/:id', function(req, res){
        var name = req.body.name && req.body.name.trim();

        Category.update({_id: req.params.id}, {
            name : name 
        }, function(err) {
            if(err) {
                console.log('update error', err);
            }

            req.flash('success', "Category Updated");
            res.location('/manage/categories');
            res.redirect('/manage/categories');
        });
    });

    router.post('/categories/delete/:id', function(req, res) {
        Category.remove({_id: req.params.id}, function(err) {
            if(err) {
                console.log(err);
            }
            req.flash('success', "Category Deleted");
            res.location('/manage/categories');
            res.redirect('/manage/categories');
        });
    });
}

