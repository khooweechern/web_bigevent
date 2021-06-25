$(function(){
    // 定义一个查询函数对象，将来请求数据的时候需要将请求参数对象提交给服务器
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
    
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
    
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
    
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
      }
    // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
      };
    initTable();
    initCase();
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                console.log(res.data);
                var htmlStrList = template('tpl-table',res);
                $('tbody').html(htmlStrList);
                // 调用渲染分页方法
                renderPage(res.total)
            }
        })
    }
    function initCase(){
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
    
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        var cate_id =$('[name=cate_id]').val();
        var state =$('[name=state]').val();
        // 为查询对象中的属性赋值
        q.cate_id =cate_id;
        q.state = state;
        // 调用函数重新渲染
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total){
        // 调用方法渲染
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: total //数据总数，从服务端得到
            ,limit:q.pagesize//每页显示几条数据
            ,curr:q.pagenum//默认选中哪一页
            ,limits:[2,3,5,10]
            ,layout:[
                'count','limit','prev','page','next' ,'skip'
            ]
            // 分页发生切换的时候触发函数
            // 触发回调的情况有两种
            // 1.点击页码的时候会触发
            // 2.只要调用laypage.render就会触发
            ,jump: function(obj, first){
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
                //obj包含了当前分页的所有参数，比如：
                q.pagenum = obj.curr; //得到当前页，以便向服务端请求对应页的数据。
                q.pagesize = obj.limit; //得到每页显示的条数
                 
                
                //首次不执行
                if(!first){
                    initTable();// 调用函数重新渲染
                  //do something
                }
              }
          });
    }
    // 事件委托绑定编辑按钮
    $('tbody').on('click','#btn-edit',function(){
        localStorage.setItem('art_id',$(this).attr("data-id"))
        location.href = '/article/art_mod.html'
    })
    // 事件委托绑定删除按钮事件
    $('tbody').on('click','#btn-del',function(){
        let len =$('#btn-del').length;
        // 获取文章id
        let id = $(this).attr('data-id');
        // 询问是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
       
        $.ajax({
            method:'GET',
            url:'/my/article/delete/'+id,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                // 如果没有剩余的数据了,则让页码值 -1 之后,
                // 再重新调用 initTable 方法
                if(len ===1){
                    // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    // 页码值最小必须是 1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                }
                initTable();    
            }
        })
        
        layer.close(index)
        })

    })
})