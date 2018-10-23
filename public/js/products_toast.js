$(function(){
    $.ajax({
        type:"get",
        url:"http://localhost:8080/products/toast",
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
                    html+=`</div>
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
                $(".toast-list .product-list").html(html);
            }
        }
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