$(function(){
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    initEditor();
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                var htmlStr = template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)
    // 为选择封面按钮添加点击事件
  $('#btnChooseImage').on('click',function(){
      $('#coverFile').click();
  })
  $('#coverFile').on('change',function(e){
    // console.log(e);
    var filelist = e.target.files;
    // console.log(filelist);
    if(filelist.length === 0){
        return layer.msg('请选择图片')
    }
    // 拿到用户选择的文件
    var file = e.target.files[0]
    // 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file)
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
 })

// 定义文章发布状态
 var art_status = '已发布';
//  为存为按钮绑定点击事件处理函数
$('#btnSave2').on('click',function(){
    art_status = '草稿' 
})

// 为表单绑定submit提交事件
$('#form-pub').on('submit',function(e){
    // 阻止表单的默认行为
    e.preventDefault();
    // 基于form表单快速创建formdata对象
    var fd = new FormData($(this)[0])
    fd.append('state',art_status)
 $image
  .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
    fd.append('cover_img',blob)
    publishArticle(fd)
  })
    
})

// 定义发布文章的方法
function publishArticle(fd){
    $.ajax({
        method:'POST',
        url:'/my/article/add',
        data:fd,
        // 注意如果向服务器提交formdata格式的数据，必须添加以下两个配置项
        contentType:false,
        processData:false,
        success:function(res){
            if(res.status !== 0){
                return layer.msg('发布失败！')
            }
            layer.msg(res.message)
            location.href = '/article/art_list.html'
        }
    })
}
})