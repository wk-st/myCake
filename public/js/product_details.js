new Vue({
    el:"#main_details",
    data:{pid:"",pics:[{product_img_id:"",lg:""}],product:{},specs:[],spec:"",hot:[],
          addStyle:{display:"none"},addClass:{"active":true}},
    methods:{
        //鼠标进入 小图换大图
        imgChange:function(e){
            var imgSm=e.target.children[0];
            var imgLg=e.target.parentNode.parentNode.previousElementSibling.children[0];
            imgLg.src=imgSm.src;
        },
        //随滚动条出现固定导航条
        handelScroll:function(){
            var scrollTop=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;//兼容各浏览器
            var offsetTop=document.querySelector("#pro_details").offsetTop+171;
            if(scrollTop>offsetTop){
                this.addStyle={display:"block"};
            }else{
                this.addStyle={display:"none"};
            }
        },
        // 点击购物车按钮
        cart:function(e){
            e.preventDefault();
            var pid=e.target.getAttribute("data-info");//商品id
            var user_id=sessionStorage.getItem("uid");//用户id
            if(!user_id){
                var userLogin=document.getElementById("user_login");
                userLogin.style.display="block";
            }else{
                var count=1;
                axios.get("http://localhost:8080/cart/info",
                {params:{
                    user_id:user_id,
                    pid:pid,
                    count:count
                }}).then(function(res){
                    var sCart=e.target.parentNode.nextElementSibling;
                    if(res.data.code==200){
                        sCart.style.display="block";
                        setTimeout(function(){
                            sCart.style.display="none";
                        },2000)
                    }
                })
            }   
        },
        // 未登录状态弹框关闭
        login:function(e){
            e.preventDefault();
            document.getElementById("user_login").style.display="none";
        }
    },
    created(){
        (async function(self){
            //获取产品id
            if(location.search.indexOf("product_id=")!=-1){
                self.pid=location.search.split("=")[1];
            }
            //获取产品详情信息
            var res=await axios.get("http://localhost:8080/details/",{
                params:{
                    product_id:self.pid
                }
            })
            if(res.data.code==200){
                self.pics=res.data.pics;
                self.product=res.data.product;
                self.specs=res.data.specs;
                self.product.sweet=Number(self.product.sweet);
                self.spec=Number(self.product.spec.slice(0,1));
                self.product.tag=self.product.tag.split(",");
                self.product.marterials=self.product.marterials.split(",");
                self.product.raw_material=self.product.raw_material.split(",");
            }
            //获取热门产品信息
            var res=await axios.get("http://localhost:8080/index/product")
            if(res.data.code==200){
                self.hot=res.data.msg.slice(0,4);
                for(var i=0;i<self.hot.length;i++){
                    self.hot[i].tag=self.hot[i].tag.split(",");
                }
            }
        })(this)
    },
    mounted(){
        window.addEventListener("scroll",this.handelScroll)
    }
})