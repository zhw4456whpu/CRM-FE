//import Vue from 'vue'
/** vue集成环信 */
var {webimConfig} = require('./webim.config.js')
let WebIM = require('easemob-websdk')
//Vue.prototype.$webim = WebIM

WebIM.config = webimConfig;

// 创建连接
const conn = new WebIM.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
    url: WebIM.config.xmppURL,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    apiUrl: WebIM.config.apiURL,
    isAutoLogin: true ,
    delivery: true,  
})
// 添加成功的回调
conn.listen({
    //连接关闭回调
    onClosed: function (message) {
        console.log('global连接关闭=>', message)
    },
    //收到文本消息
    onTextMessage: function (message) {
        console.log('global收到文本信息message=>', message)
    },
    onOpened: function ( message ) {          //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();  
        console.log('global连接打开=>', message)           
    },  
    onEmojiMessage: function ( message ) {
        console.log('global收到表情消息message=>', message)
    },   //收到表情消息
    onPictureMessage: function ( message ) {}, //收到图片消息
    onCmdMessage: function ( message ) {},     //收到命令消息
    onAudioMessage: function ( message ) {},   //收到音频消息
    onLocationMessage: function ( message ) {},//收到位置消息
    onFileMessage: function ( message ) {},    //收到文件消息
    onVideoMessage: function (message) {
        var node = document.getElementById('privateVideo');
        var option = {
            url: message.url,
            headers: {
              'Accept': 'audio/mp4'
            },
            onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
                console.log('File down load error.')
            }
        };
        WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function ( message ) {},       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function ( message ) {},         //处理好友申请
    onInviteMessage: function ( message ) {},  //处理群组邀请
    onOnline: function () {},                  //本机网络连接成功
    onOffline: function () {},                 //本机网络掉线
    onError: function ( message ) {},          //失败回调
    onBlacklistUpdate: function (list) {       //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    },
    onReceivedMessage: function(message){},    //收到消息送达服务器回执
    onDeliveredMessage: function(message){},   //收到消息送达客户端回执
    onReadMessage: function(message){},        //收到消息已读回执
    onCreateGroup: function(message){},        //创建群组成功回执（需调用createGroupNew）
    onMutedMessage: function(message){}        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
})
const options = {
    apiUrl: WebIM.config.apiURL,
    user: null,
    pwd: null,
    appKey: WebIM.config.appkey,
    accessToken: null
}
//Vue.prototype.$imconn = conn
//Vue.prototype.$imoption = options
const methods = { 
    /**登陆环信账户 */
    login: function(userName, pwd, accessToken, succ, fail){
        
        console.log("login start!");
        var options = {
            apiUrl: webimConfig.apiURL,
            user: userName,
            pwd: pwd,
            accessToken: accessToken,
            appKey: webimConfig.appkey,
            success: function (token) {
                console.log("login success callback!token is :%o",token);
                succ && succ(token);
            },
            error: function(err){
                console.log("用户名或密码错误：%o",err);
                err = err || "token is invalid！";
                fail && fail(err);
            }
        };
        console.log("login end!");
        conn.open(options);
    },
    /**重新连接 */
    reLogin: function(userName, pwd, accessToken, succ, fail){
        console.log("relogin start!");
        var options = {
            apiUrl: webimConfig.apiURL,
            user: userName,
            pwd: pwd,
            appKey: webimConfig.appkey,
            accessToken: accessToken,
            success: function (token) {
                console.log("relogin success callback!");
                succ && succ(token);
            },
            error: function(err){
                console.log("relogin用户名或密码错误");
                fail && fail(err);
            }
        };
        console.log("relogin end!");
        conn.open(options);
    },
    /**关闭连接 */
    close(){
        conn.close();
    },
    /**单聊发送文本消息 */
    sendPrivateText : function (msg) {
        console.log("sendPrivateText %o",msg);
        conn.send(msg.body);
    },
    /**群组发送文本消息 */
    sendGroupText : function (text, to, succ, fail) {
        var id = conn.getUniqueId();            // 生成本地消息id
        var msg = new WebIM.message('txt', id); // 创建文本消息
        var option = {
            msg: text,             // 消息内容
            to: to,                     // 接收消息对象(群组id)
            roomType: false,
            chatType: 'chatRoom',
            success: function (token) {
                console.log('send room text success');
                succ && succ(token);
            },
            fail: function (err) {
                console.log('failed');
                fail && fail(err);
            }
        };
        msg.set(option);
        msg.setGroup('groupchat');
        conn.send(msg.body);
    },
    /**聊天室发送文本消息 */
    sendRoomText : function (text, to, succ, fail) {
        var id = conn.getUniqueId();         // 生成本地消息id
        var msg = new WebIM.message('txt', id); // 创建文本消息
        var option = {
            msg: text,          // 消息内容
            to: to,               // 接收消息对象(聊天室id)
            roomType: true,
            chatType: 'chatRoom',
            success: function (token) {
                console.log('send room text success');
                succ && succ(token);
            },
            fail: function (err) {
                console.log('failed');
                fail && fail(err);
            }
        };
        msg.set(option);
        msg.setGroup('groupchat');
        conn.send(msg.body);
    }
}

/** vue集成环信 */
export { WebIM, conn, options, methods }