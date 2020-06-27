const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CountrySchema = new Schema({

    name: {
        type: String
    },
    code: {
        type: String
    }

});

module.exports = mongoose.model('country', CountrySchema); 