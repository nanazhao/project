/**
 * Created by Administrator on 2017/7/2.
 */
var mongoose = require("mongoose");

var userschema = require("../schemas/content");

module.exports = mongoose.model("Content", userschema);