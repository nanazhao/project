/**
 * Created by Administrator on 2017/6/27.
 */
var mongoose = require("mongoose");

var userschema = require("../schemas/user");

module.exports = mongoose.model("User", userschema);