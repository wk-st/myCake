const express=require("express");
const pool=require("../pool");
const router=express.Router();

//用户登录验证
router.post("/login",(req,res)=>{
    var {uname,upwd}=req.body;
    var regUname=/^\w{6,9}$/;
    var regUpwd=/^\w{6,12}$/;
    if(!regUname.test(uname)){
        res.send({code:-1,msg:"*用户名格式不正确"});
        return;
    }
    if(!regUpwd.test(upwd)){
        res.send({code:-1,msg:"*密码格式不正确"});
        return;
    }
    var sql=`SELECT * FROM user_info WHERE uname=? AND upwd=?`;
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            res.send({code:200,msg:result[0]})
        }else{
            res.send({code:-1,msg:"用户名或密码错误"})
        }
    })
});
//注册
//注册用户名验证
router.get("/reg/cname",(req,res)=>{
    var uname=req.query.uname;
    var sql=`SELECT * FROM user_info WHERE uname=?`;
    pool.query(sql,[uname],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            res.send({code:-1,msg:"用户名已存在"});
        }else{
            res.send({code:200});
        }
    })
})
//注册成功验证
router.post("/reg",(req,res)=>{
    var {uname,upwd,email,phone}=req.body;
    var sql=`INSERT INTO user_info(uname,upwd,email,phone) VALUES(?,?,?,?)`;
    pool.query(sql,[uname,upwd,email,phone],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200});
        }else{
            res.send({code:-1,mag:"注册失败，请重新输入信息"});
        }
    })
})
module.exports=router;