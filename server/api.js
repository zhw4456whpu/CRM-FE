var models = require('./db');//数据库链接信息
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sql');//sql语句
/******************上传组件 */
process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var uploader = require('../build/uploader-node.js')('tmp');

// 连接数据库
var conn = mysql.createConnection(models.mysql);

// 服务器的公开目录
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../../dist'));
var ACCESS_CONTROLL_ALLOW_ORIGIN = true;

conn.connect((e,args)=>{
    //console.log("连接数据库callback,e:%o, args：%o", e, args);
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
                console.log("登录用户接口 err :%o",err)
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
// 增加文章接口
router.post('/addChapter', (req, res) => {
    var sql = $sql.chapter.add;    
    var params = req.body; 
    console.log("sql",sql);
    console.log("params",params);
    conn.query(sql, [params.chapTitle, params.chapContent, params.curCategory], function(err, result) {    
        if (err) {       
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
            res.end('is over');
        }
    })
});
// 上传文件接口
router.post('/upload*', multipartMiddleware, function(req, res) {
    uploader.post(req, function(status, filename, original_filename, identifier) {
        if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "content-type")
        }
        setTimeout(function () {
            res.send(status);
        }, 500);
    });
}),
router.options('/upload', function(req, res){
    console.log('OPTIONS');
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "content-type")
        res.header("Content-Type" , "text/html");

    }
    res.status(200).send();
}),
router.get('/upload', function(req, res) {
    uploader.get(req, function(status, filename, original_filename, identifier) {
        console.log('upload GET status:%s', status);
        console.log('upload GET original_filename:%s', original_filename);
        if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
        }
        res.header("Content-Type" , "text/html");
        //res.send(status);//.status(status == 'found' ? 200 : 204)
        res.json({
            code: '0',
            message: '上传接口连接成功！',
            data: null
        });
        res.end('is over');
    });
}),
router.get('/download/:identifier', function(req, res) {
    uploader.write(req.params.identifier, res);
})
// 查询分类接口
router.get('/queryAllCategory', (req, res, next) => {
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
// 查询文章内容
router.get('/queryChapterContent', (req, res, next) => {
    var sql = $sql.chapter.queryOne;  
    var query = req.query; 
    console.log("/ sql",sql);
    console.log("/ query",query);
    res.header("Access-Control-Allow-Origin", "*");
    conn.query(sql, [query.chapterId], function(err, result) {    
        if (err) {       
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
            res.end('is over');
        }
    })
});
// 查询分类下的文章
router.get('/queryAllChapters', (req, res, next) => {
    var sql = $sql.chapter.queryAll;    
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
router.get('*', function (req, res){
    console.log('404 handler..')
    jsonWrite(res, '404 Not Found!');
    res.end('is over');
});
module.exports = router;