const express=require("express");
const pool=require("../pool");
const router=express.Router();

//蛋糕查询
router.get("/cake",(req,res)=>{
    var {taste,spec}=req.query;
    var data={};
    if(taste.length>0&&spec.length>0){
        var sql=`SELECT *,(SELECT md FROM product_img_info WHERE pid=product_id LIMIT 1) AS md FROM product_info WHERE fid=1 AND taste=? AND spec=?`;
        pool.query(sql,[taste,spec],(err,result)=>{
            if(err)throw err;
            if(result.length>0){
                data.code=200;
                data.products=result;
                res.send(data);
            }else{
                data.code=-1;
                res.send(data);
            }
        })
    }else if(taste.length>0&&spec.length==0){
        var sql=`SELECT *,(SELECT md FROM product_img_info WHERE pid=product_id LIMIT 1) AS md FROM product_info WHERE fid=1 AND taste=?`;
        pool.query(sql,[taste],(err,result)=>{
            if(err)throw err;
            if(result.length>0){
                data.code=200;
                data.products=result;
                res.send(data);
            }else{
                data.code=-1;
                res.send(data);
            }
        })
    }else if(taste.length==0&&spec.length>0){
        var sql=`SELECT *,(SELECT md FROM product_img_info WHERE pid=product_id LIMIT 1) AS md FROM product_info WHERE fid=1 AND spec=?`;
        pool.query(sql,[spec],(err,result)=>{
            if(err)throw err;
            if(result.length>0){
                data.code=200;
                data.products=result;
                res.send(data);
            }else{
                data.code=-1;
                res.send(data);
            }
        })
    }else{
        var sql=`SELECT *,(SELECT md FROM product_img_info WHERE pid=product_id LIMIT 1) AS md FROM product_info WHERE fid=1`;
        pool.query(sql,(err,result)=>{
            if(err)throw err;
            if(result.length>0){
                data.code=200;
                data.products=result;
                res.send(data);
            }else{
                data.code=-1;
                res.send(data);
            }
        })
    }
})

//吐司查询
router.get("/toast",(req,res)=>{
    var data={};
    var sql=`SELECT *,(SELECT md FROM product_img_info WHERE pid=product_id LIMIT 1) AS md FROM product_info WHERE fid=2`;
    pool.query(sql,(err,result)=>{
        if(err)throw err;
        if(result.length>0){
            data.code=200;
            data.products=result;
            res.send(data);
        }else{
            data.code=-1;
            res.send(data);
        }
    })
})

//礼品查询
router.get("/gift",(req,res)=>{
    var data={};
    var sql=`SELECT *,(SELECT md FROM product_img_info WHERE pid=product_id LIMIT 1) AS md FROM product_info WHERE fid=3`;
    pool.query(sql,(err,result)=>{
        if(err)throw err;
        if(result.length>0){
            data.code=200;
            data.products=result;
            res.send(data);
        }else{
            data.code=-1;
            res.send(data);
        }
    })
})

//产品搜索查询
router.get("/search",(req,res)=>{
    var {kw,pno}=req.query;
    var pageSize=8;
    var data={};
    var sql=`SELECT *,(SELECT md FROM product_img_info WHERE pid=product_id LIMIT 1) AS md FROM product_info WHERE title=? OR taste LIKE '%${kw}%'`;
    pool.query(sql,[kw],(err,result)=>{
        if(err)throw err;
        if(result.length>0){
            data.pno=pno;
            data.pageCount=Math.ceil(result.length/pageSize);
            data.products=result.slice(pno*pageSize,pageSize+pno*pageSize);
            res.send({code:200,msg:data})
        }else{
            res.send({code:-1})
        }
    })
})

module.exports=router;