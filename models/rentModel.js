'use strict';

var mongoose = require('mongoose');

var rentModel = function(){
    var rentSchema = mongoose.Schema({
        title: String,
        category: String,
        description: String,
        author: String,
        publisher: String,
        price: Number,
        cover: String
    });

    return mongoose.model('Rent', rentSchema);
};

module.exports = new rentModel();