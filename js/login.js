$(function(){
    // 点击去注册的连接
    $('#link_reg').on("click",function(){
        $(".login-box").hide();
        $(".reg-box").show();
    })
    // 点击去登录的连接
    $('#link_login').on("click",function(){
        $(".login-box").show();
        $(".reg-box").hide();
    })

    // 从layui获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        //   检验两次密码是否一致
        repwd:function(value){
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框的内容
            // 然后进行判断，如果不一致则返回错误
            var pwd = $('.reg-box [name="password"]').val();
            if(pwd !== value){
                return "两次密码不一致";
            }
        }
    })

    // 监听注册表单的提交事件
    /* $('#form_reg').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:"post",
            url:'http://api-breakingnews-web.itheima.net/api/reguser',
            data:{
                username:$('#form_reg [name=username]').val(),
                password:$('#form_reg [name=password]').val()
            },
            success:function(res){
                if(res.status !== 0){
                    return console.log(res.message);
                }
                console.log('注册成功');
            }

        })
    }) */
    // 监听注册表单的提交事件
$('#form_reg').on('submit', function(e) {
    // 1. 阻止默认的提交行为
    e.preventDefault()
    // 2. 发起Ajax的POST请求
    var data = {
    username: $('#form_reg [name=username]').val(),
    password: $('#form_reg [name=password]').val()
    }
    $.post('/api/reguser', data,
    function(res) {
    if (res.status !== 0) {
    return layer.msg(res.message)
    // return console.log('失败');
    }
    layer.msg('注册成功，请登录！')
    // 模拟人的点击行为
    $('#link_login').click()
    })
    })
    // 监听登录提交事件
$('#form_login').submit(function(e){
    e.preventDefault();
    $.ajax({
        url:"/api/login",
        method:'POST',
        // 快速获取表单数据
        data:$(this).serialize(),
        success:function(res){
            if(res.status !== 0){
                return layer.msg('登录失败！')
            }
            layer.msg('登录成功！');
            // 跳转到后台主页
            localStorage.setItem('token', res.token);
            location.href = '/index.html'
        }
    })
})
})