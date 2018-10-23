$(function(){
    var checkUname=false;
    var checkUpwd=false;
    //验证用户名和密码不能为空
    var $uname=$("#uname");
    $uname.focus(function(){
        $uname.next().html("*请输入用户名");
    });
    $uname.blur(function(){
        if($unameV=$uname.prop("value").trim()==""){
          $uname.next().html("*用户名不能为空");
          return checkUname=false;
        }else{
          $uname.next().html("");
          return checkUname=true;
        }  
    });
    var $upwd=$("#upwd");
    $upwd.focus(function(){
        $upwd.next().html("*请输入密码");
    });
    $upwd.blur(function(){
        if($upwdV=$upwd.prop("value").trim()==""){
          $upwd.next().html("*密码不能为空");
          return checkUpwd=false;
        }else{
          $upwd.next().html("");
          return checkUpwd=true;
        }   
    });
    //登录提示框打开,提示信息
    var $alert=$("#res_alert");  //登录提示框
    $("#login_submit").on("click",function(e){
      e.preventDefault();
      var $alertTxt=$alert.find("section");
      if(checkUname&&checkUpwd){
        $.ajax({
          type:"post",
          url:"http://localhost:8080/user/login",
          data:{uname:$uname.prop("value"),upwd:$upwd.prop("value")},
          dataType:"json",
          success:function(res){
            if(res.code==200){
              console.log(res.msg);
              sessionStorage.setItem("uname",res.msg.uname);
              sessionStorage.setItem("isLogin",true);
              sessionStorage.setItem("uid",res.msg.uid);
              location.assign("index.html");
            }else if(res.code==-1){
              $alertTxt.text(res.msg)
              $alert.fadeIn();
            }
          }
        })
      }else{
        $alertTxt.text("用户名或密码不能为空")
        $alert.fadeIn();
      }
    })
    //登录提示框关闭
    $("#res_alert a,#res_btn").on("click",function(){
      $alert.fadeOut();
    });
    // 禁止回退
    if(window.history&&window.history.pushState){
      $(window).on("popstate",function(){
        window.history.pushState('forward',null,'');
        window.history.forward(1);
      });
    }
    window.history.pushState('forward',null,'');
    window.history.forward(1);
})