const utils = require('../utils');
const generateId = utils.generateId;
const wrapper = require('strophe.js');
const xmppConfig = require('./xmpp.config');
const Strophe = wrapper.Strophe;

/**XMPP连接 */
const connection = null;
/**当前状态是否连接 */
let connected = false;

/**消息监听 */
const onListen = (msg) =>{
    console.log("onListen接收到消息=> %o", msg);
    // 接收到<message>
    this.onMessage(msg);
}

/**发送回执 */
const sendReceipts = (fromJid, toJid, msgId) =>{
    var receiptsmsg = $msg({
		to: fromJid, 
		from: toJid, 
		type: 'receipts',
		xmlns: 'peidou',
		id: 'chat-' + generateId(6)			
	}).c("mobilePeidou", null, '').c("receipts", {msgid: msgId, type: 'chat'}, '');
	connection.send(receiptsmsg.tree());
}

// 连接状态改变的事件
const onConnect = (status, cb) => {
    if (status == Strophe.Status.CONNFAIL) {
        console.log("连接失败！");
    } else if (status == Strophe.Status.AUTHFAIL) {
        console.log("登录失败！");
    } else if (status == Strophe.Status.DISCONNECTED) {
        console.log("连接断开！");
        connected = false;
    } else if (status == Strophe.Status.CONNECTED) {
        console.log("连接成功！");
        connected = true;
        // 当接收到<message>节，调用onMessage回调函数
        connection.addHandler(cb?cb:onListen, null, 'message', null, null, null);
        // 首先要发送一个<presence>给服务器（initial presence）
        connection.send($pres().tree());
    }
}

// 接收到<message>
const onMessage = (msg) => {
    console.log("onMessage接收到消息=> %o", msg);
}

/**通用发送消息 */
const onSend = (from, to, msg, cb) => {
    if(connected) {
        if(cb && typeof cb == 'function'){
            cb(msg);
            return;
        }
        else{
            // 创建一个<message>元素并发送
            var msg = $msg({
                to: to, 
                from: from, 
                type: 'chat'
            }).c("body", null, msg);
            connection.send(msg.tree());
        }
    }
}

module.exports = {
    onConnect, onMessage, onSend, sendReceipts
}