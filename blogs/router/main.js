/**
 * Created by Administrator on 2017/6/28.
 */
var express = require("express");
var router = express.Router();
var Classify = require("../models/Classify");

router.get("/",function(req,res,next){
    Classify.find().sort({_id: -1}).then(function(re){
        res.render("main/index", {
            goback: req.goback,
            reds: re
        });
    })
})

module.exports = router;