$(function(){
    // 调用获取用户基本信息函数
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click',function(){
        // 提示用户是否退出
    layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
    //清空本地存储中的token，重新跳转页面
    localStorage.removeItem('token');
    location.href='/login.html';
    // 关闭confirm询问框
    layer.close(index);
  });
    })
})
// 获取用户基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // 请求头配置对象
        // headers:{Authorization:localStorage.getItem('token')||''},
        success:function(res){
            if(res.status !== 0){
                console.log(res);
                return layui.layer.msg('获取用户信息失败');
                
            }
            // 调用渲染用户头像函数
            remderAvatar(res.data);
        },
        // // 无论成功或失败都会调用complete函数
        // complete:function(res){
        //     console.log(res);
        // // 在complete回调函数中可以用res.responseJSON拿到服务器响应回来的数据
        // if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //     // 1.强制清空token
        //     // 2.强制跳转登录页
        //     localStorage.removeItem('token');
        //     location.href='/login.html';
        // }
        // }
    })
}
function remderAvatar(user){
    var name = user.nickname || user.username;
    $("#welcom").html("欢迎&nbsp;"+name);
    if(user.user_pic !== null){
        // 渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else{
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}