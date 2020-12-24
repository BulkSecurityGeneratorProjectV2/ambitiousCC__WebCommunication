$(function () {
    var user_id = getParameter("user_id");
    loadUse();
    loadProfile(user_id);
});
function loadUse() {
    $.get("/user/findUser.do", {}, function (data) {
        if (data.user_id === null||undefined===data.user_id) {
            //未登录提醒并隐藏编辑器
            location.href="/sign";
        }
    });
}

function loadProfile(user_id) {
    $.post("/user/about/findOtherUser", {user_id: user_id}, function (res) {
        if(res!=null){
            //查询到了对象--自己或者其他人
            $("#o-user-ico").attr("src",res.user_ico);
            $("#o-nickname").html(res.nickname);
            $("#o-sex").html(res.sex);
            $("#o-des").html(res.user_des);
            $("#o-comments").html(res.user_comments);
        }
    });
}

//留言：注意这里直接使用的是文章主评论的模板
$(function () {
    //给提交按钮绑定事件:获取提交的内容同时传递到后端处理刷新页面
    $("#o-comment-main-btn").on('click',function () {
        //增加判断用户合法性
        $.get("/user/findUser.do",{},function (data) {
            if (!(null!==user.user_id||undefined!==user_id)) {
                //未登录：非法操作，强制跳转登录
                location.href="/sign";
                return true;
            } else {
                var comment = $("#o-comment-main-textarea").val();
                var user_id = parseInt(getParameter("user_id"));
                $.ajax({
                    url:"/user/about/saveComment.do",
                    type:"post",
                    data: {
                        comment:comment,
                        user_id: user_id
                    },
                    dataType:"json",
                    success: function (data) {
                        //成就？经验？I don't know
                        //防止跳转
                        if (data.flag === true) {
                            parent.layer.msg('评论成功', {shade: 0.3});
                        } else {
                            parent.layer.msg('网络异常', {shade: 0.3});
                        }
                        location.reload();
                    },
                    error: function () {
                        parent.layer.msg('服务器异常,评论失败！', {shade: 0.3});
                        return false;
                    }
                });
            }
        });
    }) ;
});


$('#show-txt').on('click', function(){
    layer.open({
        type: 2,
        title: '阅读《服务条款》',
        maxmin: true,
        shadeClose: false, //点击遮罩关闭层
        area : ['100%' , '100%'],
        content: 'registMsg.html'
    });
});

$(function(){
    //选项卡切换
    $('.category ul li').click(function(){
        indexC = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.cont').eq(indexC).addClass('active').siblings().removeClass('active');
    });
    //按钮箭头
    var catew = $('.category').width()-150;
    var cateLiw = 0;
    $('.category ul li').each(function(){
        cateLiw +=$(this).outerWidth();
    });
    var i =0;
    $('.next').click(function(){
        $('.category ul').animate({
            "margin-left":-catew+'px'
        },500);
        i++;
        if((catew+150)*i+(catew+150)>=cateLiw){
            $('.prev').show();
            $('.next').hide();
        }
    })
    $('.prev').click(function(){
        $('.category ul').animate({
            "margin-left":0+'px'
        },500);
        $(this).hide();$('.next').show();
    })
});