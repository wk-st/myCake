//价格过滤器
Vue.filter("dataFormat",function(val){
    val=Number(val);
    return val.toFixed(2)
})
var vm;
$(function(){
    //将头部引入其他页面
    $.ajax({
        type:"get",
        url:"header.html",
        success:function(res){
            $(res).replaceAll("#globalHeader");
            //登录状态显示
            vm=new Vue({
                el:"#header_top",
                data:{isLogin:"",uname:"",kw:"雪域牛乳芝士蛋糕"},
                methods:{
                    // 登录注销
                    logout:function(){
                        sessionStorage.clear();
                        this.isLogin=sessionStorage.getItem("isLogin");
                        this.uname=sessionStorage.getItem("uname");
                        console.log(this.isLogin+":"+this.uname);
                    },
                    //搜索查询
                    search:function(e){
                        e.preventDefault();
                        //搜索关键词加密
                        var $searchInput=$("#header_top .search-wrap>p>input");
                        if(location.href.indexOf("kw=")!=-1){
                            var kw=location.search.split("kw=")[1];
                            $searchInput.val(decodeURI(kw));
                        }
                        location.href=`http://localhost:8080/products_search.html?kw=${this.kw}`; 
                    }
                },
                created(){
                    this.isLogin=sessionStorage.getItem("isLogin");
                    this.uname=sessionStorage.getItem("uname");
                }
            })
            //底部导航条选中
            var $navA=$("#header_nav>ul>li>a");//导航条一的a
            var $href=$($navA[0]).prop("href");
            var href=document.location.href;
            //详情页导航高亮显示去除
            if($href!=href){
                $($navA[0]).parent().removeClass("active")
            }
            //点击导航条高亮显示
            for(var i=0;i<$navA.length;i++){
                $a=$($navA[i]);//封装a
                $href=$a.prop("href");//获取a中的href属性
                href=document.location.href;//获取地址栏的url;
                if($href==href){
                    $a.parent().addClass("active").siblings().removeClass("active");
                }
            }
            // 固定导航条显示
            $(window).scroll(function(){
                var srcollTop=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                var offsetTop=$("#header_top").height();
                if(srcollTop>offsetTop){
                    $("#header_fixed").slideDown();
                }else{
                    $("#header_fixed").slideUp();
                }
            })
            //固定导航条登录状态显示
            var $logWrap=$("#login_rwrap");
            var $logImg=$logWrap.children().eq(0);
            var isLogin=sessionStorage.getItem("isLogin");
            $logImg.on("click",function(e){
                e.preventDefault();
                if(isLogin){
                    location.href="shopping_cart.html";
                }
            })
            $logWrap.hover(
                function(e){
                    e.preventDefault();
                    if(!isLogin){
                        $logImg.next().slideToggle();
                    }
                }
            )
            //固定导航条选中
            var $navbarA=$("#header_navbar>ul>li>a");//导航条一的a
            var $href=$($navbarA[0]).prop("href");
            var href=document.location.href;
            //详情页导航高亮显示去除
            if($href!=href){
                $($navbarA[0]).parent().removeClass("active")
            }
            //点击导航条高亮显示
            for(var i=0;i<$navbarA.length;i++){
                $a=$($navbarA[i]);//封装a
                $href=$a.prop("href");//获取a中的href属性
                href=document.location.href;//获取地址栏的url;
                if($href==href){
                    $a.parent().addClass("active").siblings().removeClass("active");
                }
            }
        }
    })
})