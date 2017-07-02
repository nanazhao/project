/**
 * Created by Administrator on 2017/6/28.
 */
var express = require("express");
var router = express.Router();
var user = require("../models/User");
var Classify = require("../models/Classify");
var Content = require("../models/Content");

router.use(function(req,res,next){
    if(!req.goback.isadmin){
        res.send("只有管理员身份才能进入");
        return
    }
    next();
})

router.get("/", function(req,res,next){
    res.render("admin/index",{
        goback: req.goback
    })
})

router.get("/user",function(req,res){
    var page = Number(req.query.page || 1);

    var limit = 4;


    var pages = 0;

    user.count().then(function(count){

        pages = Math.ceil(count/limit);

        page = Math.min(page,pages);

        page= Math.max(page,1);

        var skip = (page-1)*limit;

        user.find().limit(limit).skip(skip).then(function(users){
            res.render("admin/user_index",{
                goback: req.goback,
                users: users,
                page: page,
                count: count,
                pages: pages,
                limit: limit,
                urlrou: "/user"
            })
        })
    })


})

router.get("/classify",function(req,res){
    var page = Number(req.query.page || 1);

    var limit = 4;


    var pages = 0;

    Classify.count().then(function(count){

        pages = Math.ceil(count/limit);

        page = Math.min(page,pages);

        page= Math.max(page,1);

        var skip = (page-1)*limit;

        Classify.find().sort({_id: -1}).limit(limit).skip(skip).then(function(classifys){
            res.render("admin/classify_index",{
                goback: req.goback,
                classifys: classifys,
                page: page,
                count: count,
                pages: pages,
                limit: limit,
                urlrou: "/classify"
            })
        })
    })

})

router.get("/classify/add",function(req,res){
    res.render("admin/add_index",{
        goback: req.goback
    })
})

router.post("/classify/add",function(req,res){
    var name = req.body.name || "";
    if(name == ""){
        res.render("admin/error",{
            goback: req.goback,
            message: "输入不能为空"
        });
        return
    }

    Classify.findOne({
        name: name
    }).then(function(rs){
        if(rs){
            res.render("admin/error",{
                goback: req.goback,
                message: "分类已经存在了"
            })
            return Promise.reject()
        }else{
            return new Classify({
                name: name
            }).save();
        }
    }).then(function(lalala){
        res.render("admin/success",{
            goback: req.goback,
            message: "保存成功",
            url: "/admin/Classify"
        })
    })

})

router.get("/classify/edit",function(req,res){
    var id = req.query.id || "";

    Classify.findOne({
        _id: id
    }).then(function(classifys){
        if(!classifys){
            res.render("admin/error",{
                goback: req.goback,
                message: "信息不存在"
            })
        }else{
            res.render("admin/classify_edit",{
                goback: req.goback,
                classifys: classifys
            })
        }
    })
})

router.post("/classify/edit",function(req,res){
    var id = req.query.id || "";
    var name = req.body.name || "";
    Classify.findOne({
        _id: id
    }).then(function(classifys){
        if(!classifys){
            res.render("admin/error",{
                goback: req.goback,
                message: "信息不存在"
            })
            return Promise.reject();
        }else{
            if(name == classifys.name ){
                res.render("admin/success",{
                    goback: req.goback,
                    message: "修改成功",
                    url: "/admin/classify"
                })
                return Promise.reject();
            }else{
               return Classify.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(sameclass){
        if(sameclass){
            res.render("admin/error",{
                goback: req.goback,
                message: "已经存在同名分类"
            })
            return Promise.reject();
        }else{
            return Classify.update({
                _id: id
            },{
                name:name
            })
        }
    }).then(function(){
        res.render("admin/success",{
            goback: req.goback,
            message: "修改成功",
            url: "/admin/classify"
        })
    })

})

router.get("/classify/delete",function(req,res){
    var id = req.query.id || "";
    Classify.remove({
        _id: id
    }).then(function(){
        res.render("admin/success",{
            goback: req.goback,
            message: "删除成功",
            url: "/admin/classify"
        })
    })

})

router.get("/content",function(req,res){
    var page = Number(req.query.page || 1);

    var limit = 4;


    var pages = 0;
    Content.count().then(function(count){

        pages = Math.ceil(count/limit);

        page = Math.min(page,pages);

        page= Math.max(page,1);

        var skip = (page-1)*limit;

        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate("goback").then(function(contents){
            res.render("admin/content_index",{
                goback: req.goback,
                contents: contents,
                page: page,
                count: count,
                pages: pages,
                limit: limit
            })
        })
    })
})

router.get("/content/add",function(req,res){
    Classify.find().sort({_id: -1}).then(function(re){
        res.render("admin/content_add",{
            goback: req.goback,
            names: re
        })
    })

})

router.post("/content/add",function(req,res){
    if(req.body.goback == ""){
        res.render("admin/error",{
            goback: req.goback,
            message: "内容分类不能为空"
        })
        return
    }
    if(req.body.title == ""){
        res.render("admin/error",{
            goback: req.goback,
            message: "标题不能为空"
        })
        return
    }

    Content.findOne({
        title: req.body.title
    }).then(function(re){
        if(re){
            res.render("admin/error",{
                goback: req.goback,
                message: "标题已经存在了"
            })
            return Promise.reject();
        }else{
            return new Content({
                goback: req.body.goback,
                title: req.body.title,
                description: req.body.description,
                content: req.body.content
            }).save()
        }
    }).then(function(re){
        res.render("admin/success",{
            goback: req.goback,
            message: "保存成功",
            url: "/admin/content"
        })
    })

})


router.get("/content/edit",function(req,res){
    var id = req.query.id || "";
    var name = req.body.name || "";
    var names = "";

    Classify.find().then(function(re){
        names = re;
        return Content.findOne({
            _id: id
        }).populate("goback")
        }).then(function(classifys){
            if(!classifys){
                res.render("admin/error",{
                    goback: req.goback,
                    message: "信息不存在"
                })
                return Promise.reject();
            }else{
                res.render("admin/content_edit",{
                    goback: req.goback,
                    names: names,
                    classifys: classifys
                })
            }
        })

})

router.post("/content/edit",function(req,res){
    var id = req.query.id || "";
    console.log(id)
    if(req.body.goback == ""){
        res.render("admin/error",{
            goback: req.goback,
            message: "内容分类不能为空"
        })
        return
    }
    if(req.body.title == ""){
        res.render("admin/error",{
            goback: req.goback,
            message: "标题不能为空"
        })
        return
    }
    Content.update({
        _id: id
    },{
        goback: req.body.goback,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function(){
        res.render("admin/success",{
            goback: req.goback,
            message: "内容保存成功",
            url: "/admin/content"
        })
    })

})

router.get("/content/delete",function(req,res){
    var id = req.query.id || "";
    Content.remove({
        _id: id
    }).then(function(re){
        res.render("admin/success",{
            goback: req.goback,
            message: "删除成功",
            url: "/admin/content"
        })
    })
})
module.exports = router;