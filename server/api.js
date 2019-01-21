var models = require('./db');//数据库链接信息
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sql');//sql语句

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect((e,args)=>{
    console.log("连接数据库callback,e:%o, args：%o", e, args);
});

var jsonWrite = function(res, ret) {
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
                for(var i = 0; i < result.length; i++){
                    console.log("登录用户接口result:%o", result);
                    if (result[i].user_pwd == params.userpsw) {
                        res.json({
                            code: '0',
                            message: '登录成功！',
                            data: null
                        });
                    }
                    else{
                        res.json({
                            code: '1',
                            message: '密码错误！',
                            data: null
                        });
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
            res.end('is over');
        }
    })
});
// 增加分类接口
router.post('/addCategory', (req, res) => {
    var sql = $sql.category.add;    
    var params = req.body; 
    console.log("sql",sql);
    console.log("params",params);
    conn.query(sql, [params.categoryName,params.categoryCode], function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            res.end('is over');
        }
    })
});
// 查询分类接口
router.get('/queryAll', (req, res, next) => {
    var sql = $sql.category.queryAll;    
    console.log("queryAll sql",sql);

    res.header("Access-Control-Allow-Origin", "*");
    conn.query(sql, function(err, result) {    
        if (err) {
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            res.end('is over');
        }
    })
});
// 查询分类接口
router.get('/**', (req, res, next) => {
    var sql = $sql.category.queryAll;    
    console.log("/ sql",sql);
    
    res.header("Access-Control-Allow-Origin", "*");
    conn.query(sql, function(err, result) {    
        if (err) {       
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
            res.end('is over');
        }
    })
});
// 查询分类接口
router.post('/queryAll', (req, res, next) => {
    var sql = $sql.category.queryAll;    
    console.log("post queryAll sql",sql);
    conn.query(sql, function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            res.end('is over');
        }
    })
});
module.exports = router;