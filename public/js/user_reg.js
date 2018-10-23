$(function(){
    var checkUname=false;
    var checkUpwd=false;
    var checkCpwd=false;
    var checkEmail=false;
    var checkPhone=false;
    //用户名验证
    var $uname=$("#uname");
    $uname.focus(function(){
        $uname.next().html("*请输入用户名");
    });
    $uname.blur(function(){
        var regUname=/^\w{6,9}$/;
        var $unameV=$uname.prop("value").trim();
        if($unameV==""){
            $uname.next().html("*用户名不能为空");
            return checkUname=false;
        }else if(!regUname.test($unameV)){
            $uname.next().html("*用户名格式不正确");
            return checkUname=false;
        }else{
            $.ajax({
                type:"get",
                url:"http://localhost:8080/user/reg/cname",
                data:`uname=${$unameV}`,
                dataType:'json',
                success:function(res){
                    if(res.code==-1){
                        $uname.next().html(`*${res.msg}`);
                        return checkUname=false;
                    }else if(res.code==200){
                        $uname.next().html("");
                        return checkUname=true;
                    }
                }
            })
        }
    })
    //密码验证
    var $upwd=$("#upwd");
    $upwd.focus(function(){
        $upwd.next().html("*请输入密码");
    });
    $upwd.blur(function(){
        var regUpwd=/^\w{6,12}$/;
        var $upwdV=$upwd.prop("value").trim();
        if($upwdV==""){
            $upwd.next().html("*密码不能为空");
            return checkUpwd=false;
        }else if(!regUpwd.test($upwdV)){
            $upwd.next().html("*密码格式不正确");
            return checkUpwd=false;
        }else{
            $upwd.next().html("");
            return checkUpwd=true;
        }
    })
    //确认密码验证
    var $cpwd=$("#cpwd");
    $cpwd.focus(function(){
        $cpwd.next().html("*请输入密码6-12位");
    });
    $cpwd.blur(function(){
        if($cpwd.prop("value").trim()==""){
            $cpwd.next().html("*确认密码不能为空");
            return checkCpwd=false;
        }else if($cpwd.prop("value").trim()!=$upwd.prop("value").trim()){
            $cpwd.next().html("*两次输入的密码不一致，请重新输入");
            return checkCpwd=false;
        }else{
            $cpwd.next().html("");
            return checkCpwd=true;
        }
    });
    //邮箱验证
    var $email=$("#email");
    $email.focus(function(){
        $email.next().html("*请输入合法的邮箱地址");
    });
    $email.blur(function(){
        var regEmail=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        var $emailV=$email.prop("value").trim();
        if($emailV==""){
            $email.next().html("*邮箱地址不能为空");
            return checkEmail=false;
        }else if(!regEmail.test($emailV)){
            $email.next().html("*邮箱地址格式不正确");
            return checkEmail=false;
        }else{
            $email.next().html("");
            return checkEmail=true;
        }
    });
    //手机号验证
    var $phone=$("#phone");
    $phone.focus(function(){
        $phone.next().html("*请输入合法的手机号");
    });
    $phone.blur(function(){
        var regPhone=/^1[3-8]\d{9}$/;
        var $phoneV=$phone.prop("value").trim();
        if($phoneV==""){
            $phone.next().html("*手机号不能为空");
            return checkPhone=false;
        }else if(!regPhone.test($phoneV)){
            $phone.next().html("*手机号格式不正确");
            return checkPhone=false;
        }else{
            $phone.next().html("");
            return checkPhone=true;
        }
    });
    //注册提示框打开
    var $alert=$("#res_alert");  //注册提示框
    $("#reg_submit").on("click",function(e){
        e.preventDefault();
        var $alertTxt=$alert.find("section");
        if(checkUname&&checkUpwd&&checkCpwd&&checkEmail&&checkPhone){
            var data={uname:$uname.prop("value").trim(),
                      upwd:$upwd.prop("value").trim(),
                      email:$email.prop("value").trim(),
                      phone:$phone.prop("value").trim()}
            $.ajax({
                type:"post",
                url:"http://localhost:8080/user/reg",
                data:data,
                dataType:"json",
                success:function(res){
                    if(res.code==200){
                        location.assign("user_login.html");
                    }else if(res.code==-1){
                        $alertTxt.html(res.msg);
                        $alert.fadeIn()
                    }
                }
            })
        }else{
            $alertTxt.html("请完善个人注册信息");
            $alert.fadeIn();
        }
    })
    //注册提示框关闭
    $("#res_alert a,#res_btn").on("click",function(){
        $alert.fadeOut();
    })
})