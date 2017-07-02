/**
 * Created by Administrator on 2017/6/25.
 */

var express = require("express");

var swig = require("swig");

var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Cookies = require("cookies");
var app = express();

var User = require("./models/User");
var Classify = require("./models/Classify");

app.use("/public",express.static(__dirname+"/public"));

app.engine("html",swig.renderFile);

app.set("views","./views");

app.set("view engine","html");

app.use(bodyparser.urlencoded({extended:true}));

swig.setDefaults({calse: false});

app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);

    req.goback = {};

    if(req.cookies.get("goback")){
        try {
            req.goback = JSON.parse(req.cookies.get("goback"));

            User.findById(req.goback._id).then(function(goback){
                req.goback.isadmin = Boolean(goback.isadmin);
                next()
            })
        } catch (e){
            next();
        }
    }else{
        next();
    }
});

app.use("/",require("./router/main"));
app.use("/api",require("./router/api"));
app.use("/admin",require("./router/admin"));

mongoose.connect("mongodb://localhost:27018/wang",function(err){
    if(err){
        console.log("数据库连接失败");
    }else{
        console.log("数据库连接成功");
        app.listen(8081);
    }
})
