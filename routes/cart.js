const express=require("express");
const pool=require("../pool");
const router=express.Router();

//插入商品信息
router.get("/info",(req,res)=>{
    var {pid,user_id,count}=req.query;
    var oldCount=null;
    var data={};
    (async function(){
        //查看数据库中是否有该商品
        var sql=`SELECT * FROM shopping_cart WHERE user_id=? AND pid=?`;
        await new Promise(function(open){
            pool.query(sql,[user_id,pid],(err,result)=>{
                if(err)throw err;
                if(result.length>0){
                    oldCount=result[0].product_count;
                    open();
                }else{
                    oldCount=0;
                    open();
                }
            })
        })
        count=Number(count);
        if(oldCount>0){
            //将商品修改数据库
            count+=oldCount;//商品数量计算
            var sql=`UPDATE shopping_cart SET product_count=? WHERE user_id=? AND pid=?`;
            await new Promise(function(open){
                pool.query(sql,[count,user_id,pid],(err,result)=>{
                    if(err)throw err;
                    if(result.affectedRows>0){
                        data.code=200;
                        open();
                    }else{
                        data.code=-1;
                        open();
                    }
                })
            })
        }else{
            //将商品插入数据库
            var sql=`INSERT INTO shopping_cart VALUES(NULL,?,?,?)`;
            await new Promise(function(open){
                pool.query(sql,[user_id,pid,count],(err,result)=>{
                    if(err)throw err;
                    if(result.affectedRows>0){
                        data.code=200;
                        open();
                    }else{
                        data.code=-1;
                        open();
                    }
                })
            })
        }
        res.send(data)
    })(); 
})
//读取商品信息
router.get("/check",(req,res)=>{
    var user_id=req.query.user_id;
    if(!user_id){
        res.send({code:-1});
        return;
    }
    var sql=`SELECT shopping_cart.pid,title,spec,md,price,product_count FROM product_info,product_img_info,shopping_cart WHERE (product_info.product_id = shopping_cart.pid AND shopping_cart.pid = product_img_info.pid AND shopping_cart.user_id=?)`;
    pool.query(sql,[user_id],(err,result)=>{
        if(err)throw err;
        if(result.length>0){
            res.send({code:200,msg:result})
        }else{
            res.send({code:-1})
        }
    })
})
//删除商品信息
router.get("/delete",(req,res)=>{
    var {user_id,pid}=req.query;
    var sql=`DELETE FROM shopping_cart WHERE user_id=? AND pid=?`;
    pool.query(sql,[user_id,pid],(err,result)=>{
        if(err)throw err;
        if(result.affectedRows>0){
            res.send({code:200})
        }else{
            res.send({code:-1})
        }
    })
})

module.exports=router;