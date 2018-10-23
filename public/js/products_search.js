$(function(){
    function loadPage(pno=0){
        if(location.search.indexOf("kw=")!=-1){
            var kw=decodeURI(location.search.split("kw=")[1]);
            $.ajax({
                type:"get",
                url:"http://localhost:8080/products/search",
                data:{kw,pno},
                dataType:"json",
                success:function(res){
                    var html=``;
                    if(res.code==200){
                        var {pno,pageCount,products}=res.msg;
                        //找到商品
                        var html=`<section class="search-list">
                                    <ul class="product-list clear">`;
                        for(var i=0;i<products.length;i++){
                            var {product_id,title,tag,price,md}=products[i];
                            html+=`<li class="product-item">
                                    <div class="product-item-info">
                                       <div class="product-pic">
                                         <a href="product_details.html?product_id=${product_id}" target="_blank"><img src="${md}" alt=""></a>
                                       </div>
                                       <div class="product-info">
                                         <a href="product_details.html?product_id=${product_id}">
                                           <h3 class="product-name">${title}</h3>
                                         </a>
                                         <div class="product-tag">
                                           <span class="tag">${tag}</span>
                                         </div>
                                         <div class="product-buyInfo">
                                           <span class="product-price">￥${price.toFixed(2)}</span>
                                           <a href="javascript:;" class="product-cart" data-info="${product_id}">加入购物车</a>
                                         </div>
                                       </div>
                                    </div>
                                    <div class="product-item-cartSuccess">
                                      添加成功
                                    </div>
                                   </li>`;
                        }
                        html+=`</ul>
                              </section>`;
                        $("#main_search").html(html);
                        //添加页码
                        if(pageCount>1){
                            var html=``;
                            html=`<section class="search-page clear">
                                <div class="product-page">`;
                            html+=`<a href="#">上一页</a>`;
                            for(var p=0;p<pageCount;p++){
                                html+=`<a href="#" class="${pno==p?'active':''}">${p+1}</a>`;
                            }
                            html+=`<a href="#">下一页</a>`;
                            html+=`</div>
                                </section>`;
                            $("#main_search").append(html);
                            var $page=$("#main_search .search-page .product-page");
                            if(pno==0){
                                $page.children(":first").addClass("disabled");
                            }
                            if(pno==pageCount-1){
                                $page.children(":last").addClass("disabled");
                            }
                        }
                        //多页商品展示
                        console.log($("#main_search .product-page"))
                        $("#main_search .product-page").on("click","a",function(e){
                            e.preventDefault();
                            var $a=$(this);
                            if(!$a.is(".active,.disabled")){
                                var html=$(".product-page a.active").html();
                                if($a.html()=="上一页"){
                                    pno=html-2;
                                }else if($a.html()=="下一页"){
                                    pno=html;
                                }else{
                                    pno=$a.html()-1;
                                }
                            }
                            loadPage(pno);
                        })
                    }
                }
            }).then(function(res){
                if(res.code==-1){
                    $.ajax({
                        type:"get",
                        url:"http://localhost:8080/index/product",
                        dataType:"json",
                        success:function(res){
                            if(res.code==200){
                                var html=``;
                                html=`<section class="no-content">
                                       <img src="img/404/no_content.png" alt="">
                                       <p>抱歉,未找到相关商品</p>
                                      </section>`;
                                var products=res.msg.slice(0,4);
                                html+=`<section class="other-list">
                                         <ul class="product-list clear">`;
                                for(var j=0;j<products.length;j++){
                                    var {product_id,title,tag,price,img}=products[j];
                                    html+=`<li class="product-item">
                                            <div class="product-item-info">
                                                <div class="product-pic">
                                                    <a href="product_details.html?product_id=${product_id}" target="_blank"><img src="${img}" alt=""></a>
                                                </div>
                                                <div class="product-info">
                                                    <a href="product_details.html?product_id=${product_id}">
                                                      <h3 class="product-name">${title}</h3>
                                                    </a>
                                                    <div class="product-tag">
                                                      <span class="tag">${tag}</span>
                                                    </div>
                                                    <div class="product-buyInfo">
                                                      <span class="product-price">￥${price.toFixed(2)}</span>
                                                    <a href="javascript:;" class="product-cart" data-info="${product_id}">加入购物车</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="product-item-cartSuccess">
                                            添加成功
                                            </div>
                                           </li>`;
                                }
                                html+=`</ul>
                                      </section>`;
                                $("#main_search").html(html);
                            }
                        }
                    })
                }
            }).then(function(){
                //点击购物车按钮
                $(".product-list").on("click",".product-cart",function(e){
                    e.preventDefault();
                    var $this=$(this);
                    var pid=$this.attr("data-info");//商品id
                    var user_id=sessionStorage.getItem("uid");//用户id
                    if(!user_id){
                        $("#user_login").fadeIn();
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
        }
    }
    loadPage();
    //未登录状态
    $("#user_login>a:first-child").click(function(e){
        e.preventDefault();
        $("#user_login").fadeOut()
    })
})