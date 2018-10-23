new Vue({
    el:"#main_index",
    data:{ads:[{ad_id:'',href:'',img:'',title:''},{ad_id:'',href:'',img:'',title:''},
               {ad_id:'',href:'',img:'',title:''},{ad_id:'',href:'',img:'',title:''}],
          pro_cake:[],
          pro_toast:[],
          pro_gift:[]},
    methods:{
        // 购物车点击按按钮
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
                    var sCart=e.target.parentNode.parentNode.parentNode.nextElementSibling;
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
            var res=await axios.get("http://localhost:8080/index/ad");
            if(res.data.code==200){
                self.ads=res.data.msg;
            }
            var res=await axios.get("http://localhost:8080/index/product")
            if(res.data.code==200){
                for(var i=0;i<res.data.msg.length;i++){
                    if(i<=7){
                        self.pro_cake.push(res.data.msg[i]);
                        self.pro_cake[i].tag=self.pro_cake[i].tag.split(",");
                    }else if(i<=11){
                        self.pro_toast.push(res.data.msg[i]); 
                        self.pro_toast[i-8].tag=self.pro_toast[i-8].tag.split(",");
                    }else{
                        self.pro_gift.push(res.data.msg[i]);
                        self.pro_gift[i-12].tag=self.pro_gift[i-12].tag.split(",")
                    }
                }
            }
        })(this)
    }
})
// 禁止回退
if(window.history&&window.history.pushState){
    $(window).on("popstate",function(){
      window.history.pushState('forward',null,'');
      window.history.forward(1);
    });
  }
  window.history.pushState('forward',null,'');
  window.history.forward(1);
