$(function(){
    var isLogin=sessionStorage.getItem("isLogin");
    var html=``;
    if(!isLogin){
        //未登录时
        html=`<section id="logout_cart" class="logout_cart">
                <p>您还没有登录，无法查看购物车！</p>   
                <a href="user_login.html">登录</a>
              </section>`;   
        $("#main_cart").html(html);
    }else{
        var user_id=sessionStorage.getItem("uid")
        $.ajax({
            type:"get",
            url:"http://localhost:8080/cart/check",
            data:`user_id=${user_id}`,
            dataType:"json",
            success:function(res){
                console.log(res)
                if(res.code==200){
                    html=`<section class="cart-headInfo">
                             <ul class="cart-titList clear">
                               <li class="goods-titList">商品</li>
                               <li class="card-titList">生日牌</li>
                               <li class="price-titList">单价</li>
                               <li class="num-titList">数量</li>
                               <li class="money-titList">金额</li>
                             </ul>
                           </section>`;
                    html+=`<section class="cart-goodsList">
                             <table>
                              <tbody>`;
                    for(var i=0;i<res.msg.length;i++){
                        var {pid,title,spec,md,price,product_count}=res.msg[i];
                        html+=`<tr>
                                 <td class="item-goodsList"><input type="checkbox"></td>
                                 <td class="img-goodsList"><a href="product_details.html?product_id=${pid}"><img src="${md}" alt=""></a></td>
                                 <td class="info-goodsList">
                                     <div>
                                         <h3><a href="product_details.html?product_id=${pid}">${title}</a></h3>
                                         <span>规格：<span>${spec}</span></span>
                                     </div>
                                 </td>
                                 <td class="card-goodsList">
                                     <select>
                                         <option value="0">请选择生日牌</option>
                                         <option value="国庆节快乐">国庆节快乐</option>
                                         <option value="生日快乐">生日快乐</option>
                                         <option value="中秋节快乐">中秋快乐</option>
                                     </select>
                                 </td>
                                 <td class="price-goodsList">
                                     ￥${price.toFixed(2)}
                                 </td>
                                 <td class="num-goodsList">
                                     <input type="button" value="-">
                                     <input type="text" value="${product_count}">
                                     <input type="button" value="+">
                                 </td>
                                 <td class="money-goodsList">
                                     ￥${(product_count*price).toFixed(2)}
                                 </td>
                                 <td class="delete-goodsList">
                                     <a href="javascript:;" data-info="${pid}"><img src="img/icon/delete.png" alt="" class="icon-sm"></a>
                                 </td>
                               </tr>`;
                    }
                    html+=`</tbody>
                         </table>
                        </section>`;
                    html+=`<section class="cart-submit">
                               <div class="cart-submit-checkbox">
                                   <input type="checkbox">
                                   <span>全选</span>
                               </div>
                               <div class="total-submit">
                                   合计:￥
                                   <span>0.00</span>
                               </div>
                               <a href="javascript:;" class="order-submit">结算</a>
                           </section>`;
                    $("#main_cart").html(html);
                }else{
                    html=`<section id="logout_cart" class="logout_cart">
                            <p>您的购物车里还没有商品</p>   
                            <a href="products_cake.html">去购物</a>
                          </section>`;
                    $("#main_cart").html(html);
                }
            }
        }).then(function(){
            //删除商品
            $(".cart-goodsList .delete-goodsList>a").click(function(e){
                e.preventDefault();
                var $this=$(this);
                var pid=$this.attr("data-info");
                $.ajax({
                    type:"get",
                    url:"http://localhost:8080/cart/delete",
                    data:`user_id=${user_id}&pid=${pid}`,
                    success:function(res){
                        if(res.code==200){
                            $this.parent().parent().remove();
                            console.log($(".cart-goodsList tbody").children())
                            if($(".cart-goodsList tbody").children().length==0){
                                var html=`<section id="logout_cart" class="logout_cart">
                                            <p>您的购物车里还没有商品</p>   
                                            <a href="products_cake.html">去购物</a>
                                          </section>`;
                                $("#main_cart").html(html);
                            }
                        }
                    }
                })
            })
        }).then(function(){
            var $moneyTotal=$(".cart-submit .total-submit>span");//总价            
            // 商品数量按钮
            $(".cart-goodsList>table>tbody").on("click","input[type=button]",function(){
                var $this=$(this);
                var $price=$this.parent().prev();
                price=$price.html().split("￥")[1];//单价
                var $total=$this.parent().next();
                total=$total.html().split("￥")[1];//总价
                var $input=$this.parent().siblings().eq(0).children().eq(0);//商品自己选中按钮
                var mTotal=Number($moneyTotal.html());
                if($this.val()=="-"){
                    var count=$this.next().val();
                    if(count>1){
                        count--;
                        if($input.is(":checked")){
                            mTotal-=Number(price);
                        }  
                    }else{
                        count=1;
                    }
                    total=Number(count)*Number(price);
                    $this.next().val(count);
                    $total.html("￥"+total.toFixed(2));
                    
                    $moneyTotal.html(mTotal.toFixed(2));
                }else if($this.val()=="+"){
                    var count=$this.prev().val();
                    count++;
                    total=Number(count)*Number(price);
                    $this.prev().val(count);
                    $total.html("￥"+total.toFixed(2));
                    if($input.is(":checked")){
                        mTotal+=Number(price);
                    }
                    $moneyTotal.html(mTotal.toFixed(2));
                }
            })
            //全选中商品
            var $inputTotal=$(".cart-submit input[type=checkbox]");//全选按钮
            $(".cart-goodsList>table>tbody").on("click","input[type=checkbox]",function(){
                var $this=$(this);
                var $inputAll=$(".cart-goodsList>table>tbody input[type=checkbox]");//所有商品复选框
                var total=$this.parent().siblings().eq(5).html().split("￥")[1];//选中商品总价
                var mTotal=Number($moneyTotal.html());
                if($this.is(":checked")){
                    $this.prop("checked",true);
                    mTotal+=Number(total);
                }else{
                    $this.prop("checked",false);
                    mTotal-=Number(total);
                } 
                $moneyTotal.html(mTotal.toFixed(2));
                if($inputAll.is(":not(:checked)")){
                    $inputTotal.prop("checked",false);
                }else{
                    $inputTotal.prop("checked",true);
                }
            })
            $inputTotal.on("click",function(e){
                var $this=$(this);
                var $inputAll=$(".cart-goodsList>table>tbody input[type=checkbox]");//所有商品复选框
                var mTotal=Number($moneyTotal.html());
                if($inputTotal.is(":checked")){
                    console.log(1)
                    for(var i=0;i<$inputAll.length;i++){
                        var $inputI=$($inputAll[i]);
                        if(!$inputI.is(":checked")){
                            $inputI.prop("checked",true)
                            var total=$inputI.parent().siblings().eq(5).html().split("￥")[1];
                            mTotal+=Number(total);
                        } 
                    }
                    $moneyTotal.html(mTotal.toFixed(2));
                }else{
                    $inputAll.prop("checked",false);
                    mTotal=0;
                    $moneyTotal.html(mTotal.toFixed(2));
                }
            })
        })
    }
})