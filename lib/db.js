'use strict';

var mongoose = require('mongoose');

var db = function(){
    return {
        config : function(conf){
            mongoose.connect("mongodb+srv://midxdle:fFbE2DpWoxmGTAXF@cluster0.axsj3.mongodb.net/tekbooks?retryWrites=true&w=majority");
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'Connection Error'));
            db.once('open' ,function(){
                console.log('DB Connection Open...');
            });
        }
    }
}

module.exports = db();