/**
 * Created by Administrator on 2017/7/2.
 */
var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    //关联字段
    goback:{
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Classify'
    },
    title: String,

    description: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    }
})