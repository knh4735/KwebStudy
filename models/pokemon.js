/**
 * Created by Nagion on 2016. 11. 2..
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pokemonSchema = new Schema({
    no: Number,
    name: String,
    type: String,
    expl: String
});

module.exports = mongoose.model('pokemon', pokemonSchema);