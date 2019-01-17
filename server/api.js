var models = require('./db');//数据库链接信息
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sql');//sql语句

// 连接数据库
var conn = mysql.createConnection(models.mysql);
console.log("连接数据库conn:%o",conn);

conn.connect((e,args)=>{
    console.log("连接数据库callback,e:%o, args：%o", e, args);
});

var jsonWrite = function(res, ret) {
    console.log("jsonWrite res:%o", res);
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            message: '操作失败',
            data: ret
        });
    } 
    else {
        res.json({
            code: '0',
            message: '操作成功',
            data: ret
        });
    }
};

// 登录用户接口
router.post('/login', (req, res) => {
    
    var sql = $sql.user.login;    
    var params = req.body; 
    console.log("sql",sql);
    console.log("params",params);
    try{
        conn.query(sql, [params.username], function(err, result) {    
            if (err) {       
                console.log("err :%o",err)
            }        
            if (result) {
                jsonWrite(res, result);
                for(var i = 0; i < result.length; i++){
                    console.log("请求回来result: %o！",result)
                    if (result[i].userpsw == params.userpsw) {
                        res.send("返回回来了！");
                    }
                }
                res.end('is over');
            }
        })
    }catch(e){
        console.log("try catch异常 :%o",e)
    }
    
});
// 增加用户接口
router.post('/addUser', (req, res) => {
    var sql = $sql.user.add;    
    var params = req.body; 
    console.log("sql",sql);
    console.log("params",params);
    conn.query(sql, [params.username,params.userpsw], function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            for(var i = 0; i < result.length; i++){
                console.log("请求回来！",result[i])
                console.log("请求结果！",typeof result[i],result[i].userpsw);
                if (result[i].userpsw == params.userpsw) {
                    res.send("返回回来了！");
                }
            }
            res.end('is over');
        }
    })
});
module.exports = router;