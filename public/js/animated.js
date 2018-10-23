$(function(){
    $.ajax({
        type:"get",
        url:"http://localhost:8080/index/banner",
        dataType:"json",
        success:function(res){
            if(res.code==200){
                var html=``;
                for(var i=0;i<res.msg.length;i++){
                    html+=`<li class="banner-item"><a href="${res.msg[i].href}" target="_blank"><img src="${res.msg[i].img}" alt="${res.msg[i].title}"></a></li>`;
                }
                var $banner=$("#banner");
                var $banner_main=$("#banner_main");//轮播图 ul
                //插入轮播图图片
                var $html=$(html);
                $banner_main.append($html);
                var imgWidth=$banner_main.children().eq(0).width();//获取图片的宽度
                var imgHeight=$banner_main.children().eq(0).height();//获取图片的高度
                var number=$banner_main.children(); //轮套图 所有li
                var timer=null;
                var sw=0;
                //初始轮播图区域的高度
                $banner.css("height",imgHeight);
                number.css("width",imgWidth)
                //封装图片切换函数
                function animate(){
                    sw++;
                    if(sw==number.length){
                        sw=0;
                    }
                    number.eq(sw).css("z-index",2).siblings().css("z-index",1);
                }
                //每张图片完成自动切换
                timer=setInterval(animate,3000)
                //左右按钮控制
                $(".banner-btn-next").stop(true).click(function(){
                    sw++;
                    if(sw==number.length){
                        sw=0;
                    }
                    number.eq(sw).css("z-index",2).siblings().css("z-index",1)
                });
                $(".banner-btn-prev").stop(true).click(function(){
                    sw--;
                    if(sw<0){
                        sw=number.length-1;
                    }
                    number.eq(sw).css("z-index",2).siblings().css("z-index",1)
                })
                //悬停暂停并显示按钮
                $banner.hover(
                    function(){
                        $("#banner_btn").fadeIn();
                    },
                    function(){
                        $("#banner_btn").fadeOut();
                    }
                )
            }
        }
    })
    
})