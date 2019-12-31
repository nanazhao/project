/**
 * Created by Administrator on 2017/6/27.
 */
var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    isadmin: {
        type: Boolean,
        default: false
    }
})