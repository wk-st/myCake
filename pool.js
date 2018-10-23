//创建mysql连接池
const mysql=require("mysql");
const pool=mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"nx",
    connectionLimit:10
});
//把创建好的连接池导出
module.exports=pool;