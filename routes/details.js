const express=require("express");
const pool=require("../pool");
const router=express.Router();

//查询产品详情
router.get("/",(req,res)=>{
    var pid=req.query.product_id;
    var data={};
    (async function(){
        //按pid查询商品信息--异步
        var sql=`SELECT * FROM product_info WHERE product_id=?`;
        await new Promise(function(open){
            pool.query(sql,[pid],(err,result)=>{
                if(err)throw err;
                if(result.length>0){
                    data.code=200;
                    data.product=result[0];
                    open();
                }else{
                    data.code=-1;
                    open();
                }
            })
        })
        //按pid查询商品规格--异步
        var sql=`SELECT product_id,spec FROM product_info WHERE title=(SELECT title FROM product_info WHERE product_id=?)`;
        await new Promise(function(open){
            pool.query(sql,[pid],(err,result)=>{
                if(err)throw err;
                if(result.length>0){
                    data.code=200;
                    data.specs=result;
                    open();
                }else{
                    data.code=-1;
                    open();
                }
            })
        })
        //按pid查询获取商品图片列表--异步
        var sql=`SELECT product_img_id,lg FROM product_img_info WHERE pid=?`;
        await new Promise(function(open){
            pool.query(sql,[pid],(err,result)=>{
                if(err)throw err;
                if(result.length>0){
                    data.code=200;
                    data.pics=result;
                    open()
                }else{
                    data.code=-1;
                    open()
                }
            })
        })
        res.send(data);
    })()
})

module.exports=router;