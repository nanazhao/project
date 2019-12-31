/**
 * Created by Administrator on 2017/6/28.
 */
var express = require("express");
var router = express.Router();

var User = require("../models/User");

var responsedata;

router.use(function(req,res,next){
    responsedata = {
        code: 0,
        message: ""
    };
    next();
});

router.post("/user/register",function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if(!username){
        responsedata.code = 1;
        responsedata.message = "用户名不能为空";
        res.json(responsedata);
        return
    }
    if(!password){
        responsedata.code = 2;
        responsedata.message = "密码不能为空";
        res.json(responsedata);
        return
    }
    if(password != repassword){
        responsedata.code = 3;
        responsedata.message = "密码不一致";
        res.json(responsedata);
        return
    }

   User.findOne({
        username: username
    }).then(function( userInfo ){
            if(userInfo){
                responsedata.code = 4;
                responsedata.message = "用户名已经被注册了";
                res.json(responsedata);
                return
            }
       var user = new User({
           username: username,
           password: password
        })
        return user.save();
        }).then(function(newUserInfo){
            console.log(newUserInfo)
       responsedata.code = 0;
       responsedata.message = "注册成功";
       responsedata.goback = {
           _id: newUserInfo._id,
           username: newUserInfo.username
       };
       req.cookies.set("goback", JSON.stringify({
           _id: newUserInfo._id,
           username: newUserInfo.username
       }));
       res.json(responsedata);
   })

})

router.post("/user/firstmuen",function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    if( !username || !password ){
        responsedata.code = 6;
        responsedata.message = "用户名密码不能为空";
        res.json(responsedata);
        return
    }
    User.findOne({
        username: username,
        password: password
    }).then(function( userInfo ){
        if(!userInfo){
            responsedata.code = 5;
            responsedata.message = "此用户名没有注册";
            res.json(responsedata);
            return
        }
        responsedata.message = "登录成功";
        responsedata.goback = {
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set("goback", JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responsedata);
        return
    })
})

router.get("/user/signout",function(req,res){
    req.cookies.set("goback", null);
    res.json(responsedata);
})

module.exports = router;