$(function(){
    var layer = layui.layer;
    var form =layui.form;
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                // console.log(res);
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null;
    $('#btnAddCate').on('click',function(){
        // 给弹出层添加索引
        indexAdd = layer.open({
            title: '添加文章分类'
            ,content: $('#dialog-add').html()
            ,type:1
            ,area: ['500px', '250px']
        })
    })
    // 通过事件委托为form表单绑定submit事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                initArtCateList();
                // 根据索引关闭对应弹出层
                layer.close(indexAdd)
                
            }
        })
    })
    // 通过事件委托为btn-edit添加事件
    var indexEdit = null;
    $('tbody').on('click','#btn-edit',function(){
        indexEdit = layer.open({
            title: '修改文章分类'
            ,content: $('#dialog-edit').html()
            ,type:1
            ,area: ['500px', '250px']
        })
    // console.log($(this).attr('data-id'));
    let id = $(this).attr('data-id');
    $.ajax({
        method:'GET',
        url:'/my/article/cates/'+ id,
        success:function(res){
            form.val('form-edit',res.data)
        }
    })
    })
// 通过事件委托为form-edit表单绑定submit事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                initArtCateList();
                // 根据索引关闭对应弹出层
                layer.close(indexEdit)
                
            }
        })
    })

       // 通过事件委托为btn-del添加事件
    //    var indexDel =null
       $('tbody').on('click','#btn-del',function(){
        let id = $(this).attr('data-id');
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                       method:'GET',
                       url:'/my/article/deletecate/'+ id,
                       success:function(res){
                        if(res.status !== 0){
                            // console.log(res);
                            return layer.msg(res.message)
                            
                        }
                        layer.msg(res.message);
                        layer.close(index);
                        initArtCateList();
                        }
                   })
            
            
          });
       // console.log($(this).attr('data-id'));
    //    
    //    
       })
})