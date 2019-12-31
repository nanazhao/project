/**
 * Created by Administrator on 2017/6/28.
 */
$(function(){
    $("#zhushi").find("a").on("click",function(){
        $("#form").hide();
        $("#form2").show();
    })
    $("#zhushi2").find("a").on("click",function(){
        $("#form2").hide();
        $("#form").show();
    })

    $("#btn").on("click",function(){
        var username = $("#form2").find('[name="username"]');
        var password = $("#form2").find('[name="password"]');
        var repassword = $("#form2").find('[name="repassword"]');
        $.ajax({
            type:"post",
            url:"/api/user/register",
            data: {
                username: username.val(),
                password: password.val(),
                repassword: repassword.val()
            },
            dataType:"json",
            success:function(reslut){
                if(reslut.code == 1){
                    $("#form2").find(".usertip").html(reslut.message)
                }
                if(reslut.code == 2){
                    $("#form2").find(".passtip").html(reslut.message)
                }
                if(reslut.code == 3){
                    $("#form2").find(".repasstip").html(reslut.message)
                }
                if(reslut.code == 4){
                    $("#form2").find(".btntip").html(reslut.message)
                }
                if(!reslut.code){
                    $("#form2").find(".btntip").html(reslut.message);
                    setTimeout(function(){
                        window.location.reload();
                    },1000)
                }
            }
        })
    })


    $("#form").find("[type='button']").on("click",function(){
        var username = $("#form").find('[name="username"]');
        var password = $("#form").find('[name="password"]');
        $.ajax({
            type: "post",
            url: "/api/user/firstmuen",
            data: {
                username: username.val(),
                password: password.val(),
            },
            dataType: "json",
            success: function(reslut){
                console.log(reslut);
                if(reslut.code == 6){
                    $("#form").find(".btntip").html(reslut.message);
                    return
                }
                if(reslut.code == 5){
                    $("#form").find(".btntip").html(reslut.message);
                }
                $("#form").find(".btntip").html(reslut.message);
                window.location.reload();
            }
        })
    })

    $(".signout").on("click",function(){
        $.ajax({
            url: "/api/user/signout",
            success: function(reslut){
                if(!reslut.code){
                    window.location.reload();
                }
            }
        })
    })

})