$(function(){
    //口味高亮显示查找
    var $taste=$(".cake-label .cake-taste-label .active");
    var taste=$taste.attr("data-taste");
    //规格高亮显示查找
    var $spec=$(".cake-label .cake-spec-label .active");
    var spec=$spec.attr("data-spec");
    $.ajax({
        type:"get",
        url:"http://localhost:8080/products/cake",
        data:`taste=${taste}&spec=${spec}`,
        dataType:"json",
        success:function(res){
            if(res.code==200){
                var html=``;
                for(var i=0;i<res.products.length;i++){
                    var {product_id,title,tag,price,md}=res.products[i];
                    tag=tag.split(",");
                    html+=`<li class="product-item">
                    <div class="product-item-info">
                        <div class="product-pic">
                            <a href="product_details.html?product_id=${product_id}" target="_blank"><img src="${md}" alt=""></a>
                        </div>
                        <div class="product-info">
                            <a href="product_details.html?product_id=${product_id}" target="_blank">
                                <h3 class="product-name">${title}</h3>
                            </a>
                            <div class="product-tag">`
                            for(var j=0;j<tag.length;j++){
                                html+=`<span class="tag">${tag[j]}</span>`
                            }         
                    html+=` </div>
                            <div class="product-buyInfo">
                                <span class="product-price">￥${price.toFixed(2)}</span>
                                <a href="javascript:;" class="product-cart" data-info="${product_id}">加入购物车</a>
                            </div>
                        </div>
                    </div>
                    <div class="product-item-cartSuccess">
                        添加成功
                    </div>
                </li>`
                }
                $(".cake-list .product-list").html(html);
            }
        }
    }).then(function(res){
        //按口味、规格高亮显示并查找
        $(".cake-label .cake-taste-label,.cake-label .cake-spec-label").on("click","dd",function(){
            $(this).addClass("active").siblings().removeClass("active");
            var $dt=$(this).parent().children().eq(0);
            var $html=$dt.html().slice(0,2);//获取标签名称
            if($html=="口味"){
                taste=$(this).attr("data-taste");
            }else if($html=="规格"){
                spec=$(this).attr("data-spec");
            }
            $.ajax({
                type:"get",
                url:"http://localhost:8080/products/cake",
                data:`taste=${taste}&spec=${spec}`,
                dataType:"json",
                success:function(res){
                    var html=``;
                    if(res.code==200){
                        for(var i=0;i<res.products.length;i++){
                            var {product_id,title,tag,price,md}=res.products[i];
                            tag=tag.split(",");
                            html+=`<li class="product-item">
                            <div class="product-item-info">
                                <div class="product-pic">
                                    <a href="product_details.html?product_id=${product_id}" target="_blank"><img src="${md}" alt=""></a>
                                </div>
                                <div class="product-info">
                                    <a href="product_details.html?product_id=${product_id}" target="_blank">
                                        <h3 class="product-name">${title}</h3>
                                    </a>
                                    <div class="product-tag">`
                                    for(var j=0;j<tag.length;j++){
                                        html+=`<span class="tag">${tag[j]}</span>`
                                    }     
                            html+=`</div>
                                    <div id="pro_cart" class="product-buyInfo">
                                        <span class="product-price">￥${price.toFixed(2)}</span>
                                        <a href="javascript:;" class="product-cart" data-info="${product_id}">加入购物车</a>
                                    </div>
                                </div>
                            </div>
                            <div class="product-item-cartSuccess">
                                添加成功
                            </div>
                        </li>`
                        }
                        $(".cake-list .product-list").html(html);
                    }else{
                        html=`<section class="no-content">
                                <img src="img/404/no_content.png" alt="">
                                <p>抱歉,未找到相关商品</p>
                              </section>`;
                        $(".cake-list .product-list").html(html);
                    }
                }
            })
        }) 

    }).then(function(){
        //点击购物车按钮
        $(".product-list").on("click",".product-cart",function(e){
            e.preventDefault();
            var $this=$(this);
            var pid=$this.attr("data-info");//商品id
            var user_id=sessionStorage.getItem("uid");//用户id
            if(!user_id){
                $("#user_login").fadeIn()
            }else{
                var count=1;
                $.ajax({
                    type:"get",
                    url:"http://localhost:8080/cart/info",
                    data:`user_id=${user_id}&pid=${pid}&count=${count}`,
                    dataType:"json",
                    success:function(res){
                        var $sCart=$this.parent().parent().parent().next();
                        if(res.code==200){
                            $sCart.fadeIn();
                            setTimeout(function(){
                                $sCart.fadeOut()
                            },2000)
                        }
                    }
                })
            }
        })
    })
    //未登录状态
    $("#user_login>a:first-child").click(function(e){
        e.preventDefault();
        $("#user_login").fadeOut()
    })
})