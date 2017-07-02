/**
 * Created by Administrator on 2017/7/1.
 */
var mongoose = require("mongoose");

var userschema = require("../schemas/classify");

module.exports = mongoose.model("Classify", userschema);