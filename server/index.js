// node 后端服务器

const api = require('./api');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 服务开启后访问指定编译好的dist文件下的数据

app.use(express.static(__dirname + '/static'))//将文件设置成静态
// app.get('*', function(req, res) {
//     const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
//     res.send(html)
// })
// 后端api路由
app.use('/api', api);
// 监听端口
app.listen(8088);
console.log('success listen at port:8088......');
