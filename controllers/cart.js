'use strict';

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');
var Rent = require('../models/rentModel');

module.exports = function(router) {

    router.get('/', function(req, res) {
        Book.find({},{}, function(err, books){
            if(err){
                console.log(err);
            }

            var model = {
                books: books
            }

            res.render('cart/index', model);
        });
    });

    router.post('/:id', function(req, res) {

            Book.findOne({_id : req.params.id}, function(err, book) {
                if(err) {
                    console.log(err);
                }
                if(book.qty == 10){
                    var newRent = Rent({
                        _id : book._id,
                        title : book.title,
                        description : book.description,
                        category : book.category,
                        author : book.author,
                        publisher : book.publisher,
                        price : book.price,
                        qty : 1,
                        cover : book.cover
                    });
                    newRent.save(function(err) {
                        if(err) {
                            console.log('save error', err);
                        }
                    });

                    if(book.qty == 1) {
                        Book.remove({_id: req.params.id}, function(err) {
                            if(err) {
                                console.log(err);
                            }
                        });
                    } else {
                        Book.updateOne({_id: req.params.id}, {
                            qty : book.qty - 1
                        }, function(err) {
                            if(err) {
                                console.log(err);
                            }
                    });
                }
                    
    
                    req.flash('success', "Book Rented");
                    res.location('/cart');
                    res.redirect('/cart');
                } else {
                    Rent.updateOne({_id: req.params.id}, {
                        qty : 11 - book.qty 
                    },function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });

                    if(book.qty == 1) {
                        Book.remove({_id: req.params.id}, function(err) {
                            if(err) {
                                console.log(err);
                            }
                        });
                    } else {
                        Book.updateOne({_id: req.params.id}, {
                            qty : book.qty - 1
                        }, function(err) {
                            if(err) {
                                console.log(err);
                            }
                    });
                }
                    
    
                    req.flash('success', "Book Rented");
                    res.location('/cart');
                    res.redirect('/cart');
                }
            
            });
        });

    // router.get('/', function(req, res) {
    //     var cart = req.session.cart;
    //     var displayCart = {items: [], total:0};
    //     var total = 0;

    //     for(var item in cart) {
    //         displayCart.items.push(cart[item]);
    //         total += (cart[item].qty * cart[item].price);

    //     }
    //     displayCart.total = total;

    //     res.render('cart/index', {
    //         cart : displayCart
    //     });
    // });

    // router.post('/:id', function(req, res) {
    //     req.session.cart = req.session.cart || {};
    //     var cart = req.session.cart;

    //     Book.findOne({_id : req.params.id}, function(err, book) {
    //         if(err) {
    //             console.log(err);
    //         }

    //         if(cart[req.params.id]) {
    //             cart[req.params.id].qty++
    //         } else {
    //             cart[req.params.id] = {
    //                 item : book._id,
    //                 title : book.title,
    //                 price : book.price,
    //                 qty : 1
    //             }
    //         }

    //         res.redirect('/cart');
    //     });
    // });

    // router.get('/remove', function(req, res) {
    //     req.session.destroy();
    //     res.redirect('/cart');
    // });
}

// router.post('/rent/:id', function(req, res) {
//     // Rent.save({_id: req.params.id}, function(err) {
//     //     if(err) {
//     //         console.log(err);
//     //     }

//     req.session.cart = req.session.cart || {};
//     var cart = req.session.cart;

//     Book.findOne({_id : req.params.id}, function(err, book) {
//         if(err) {
//             console.log(err);
//         }

        
//         // cart[req.params.id] = {
//         //     _id : book._id,
//         //     title : book.title,
//         // }

//         //console.log(cart);
//         //console.log(cart[req.params.id]);
//         var newRent = Rent({
//             _id : book._id,
//             title : book.title
//         });
        
        
//     // var _id = req.body._id
//     // var title = req.body.title
//     // console.log(_id);
//     // console.log(title);
     

//         // var rent = Rent({
//         //     _id : _id,
//         //     title : title
//         // });

//         //console.log(rent);

//         newRent.save(function(err) {
//             if(err) {
//           console.log('save error', err);
//         }

//         req.flash('success', "Book Rented");
//         res.location('/cart/rent');
//         res.redirect('/cart/rent');
        
// });
// });