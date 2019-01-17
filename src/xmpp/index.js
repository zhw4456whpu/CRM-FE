const xmppConfig = require('./xmpp.config')
const sdk = require('./sdk')

export default {
    config: xmppConfig, sdk
}
// $(document).ready(function() {

//     // 通过BOSH连接XMPP服务器
//     $('#btn-login').click(function() {
//         if(!connected) {
//             connection = new Strophe.Connection(BOSH_SERVICE);
//             connection.connect($("#input-jid").val(), $("#input-pwd").val(), onConnect);
//             jid = $("#input-jid").val();
//         }
//     });
    
//     // 发送消息
//     $("#btn-send").click(function() {
//         if(connected) {
//             if($("#input-contacts").val() == '') {
//                 alert("请输入联系人！");
//                 return;
//             }

//             // 创建一个<message>元素并发送
//             var msg = $msg({
//                 to: $("#input-contacts").val(), 
//                 from: jid, 
//                 type: 'chat'
//             }).c("body", null, 'chat-msg').c("mobilePeidou", null, $("#input-msg").val());
//             connection.send(msg.tree());

//             $("#msg").append(jid + ":<br>" + $("#input-msg").val() + "<br>");
//             $("#input-msg").val('');
//         } else {
//             alert("请先登录！");
//         }
//     });
// });