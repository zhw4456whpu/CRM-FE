export const specialCharsPatrn = /[(`~!@#$%^&*()_\-+=<>?:"{}\|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}\|《》？：“”【】、；‘’，。、)*]/ig;

/**请求头 Content-Type */
export const Headers = {
    json:{
        'Content-Type': 'application/json;charset=UTF-8'
    },
    urlencoded:{
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}
/**展开/收起 */
export const IsExpand = {
    expand: '展开',
    pickup: '收起'
};

/**告警信息，key为接口名称 */
export const Warning = {
    getHxAccount: '没有获取到当前登录人员环信账号信息',
}

/**增删改查 成功 */
export const ADUQ_Success = {
    add: '新增成功',
    delete: '删除成功',
    update: '修改成功',
    query: '查询成功'
}

/**增删改查 失败 */
export const ADUQ_Failed = {
    add: '新增失败',
    delete: '删除失败',
    update: '修改失败',
    query: '查询失败'
}

/**表情编码 */
export const emojiCode = [
    '[/&哈哈#/]',
    '[/&戴口罩#/]',
    '[/&呲牙#/]',
    '[/&大笑#/]',
    '[/&微笑#/]',
    '[/&开心#/]',
    '[/&紧张#/]',
    '[/&闭眼#/]',
    '[/&蒙圈#/]',
    '[/&眨眼#/]',
    '[/&害羞#/]',
    '[/&馋嘴#/]',
    '[/&思考#/]',
    '[/&喜欢#/]',
    '[/&得意#/]',
    '[/&假笑#/]',
    '[/&不高兴#/]',
    '[/&不开心#/]',
    '[/&鄙视#/]',
    '[/&紧张#/]',
    '[/&困#/]',
    '[/&不屑#/]',
    '[/&困惑#/]',
    '[/&嘟嘴#/]',
    '[/&飞吻#/]',
    '[/&亲嘴#/]',
    '[/&爱你#/]',
    '[/&调皮#/]',
    '[/&鬼脸#/]',
    '[/&失望#/]',
    '[/&难过#/]',
    '[/&生气#/]',
    '[/&愤怒#/]',
    '[/&哭泣#/]',
    '[/&气愤#/]',
    '[/&不明白#/]',
    '[/&害怕#/]',
    '[/&叹气#/]',
    '[/&大哭#/]',
    '[/&冷汗#/]',
    '[/&惊恐#/]',
    '[/&不敢看#/]',
    '[/&发呆#/]',
    '[/&睡觉#/]',
    '[/&恶魔#/]',
    '[/&不#/]',
    '[/&高兴#/]',
    '[/&握拳#/]',
    '[/&布#/]',
    '[/&手势#/]',
    '[/&爱心#/]',
    '[/&秘密#/]',
    '[/&中国#/]',
    '[/&德国#/]',
    '[/&西班牙#/]',
    '[/&法国#/]',
    '[/&英国#/]',
    '[/&意大利#/]',
    '[/&日本#/]',
    '[/&韩国#/]',
    '[/&俄罗斯#/]',
    '[/&美国#/]',
    '[/&衰#/]',
    '[/&阳光#/]',
    '[/&面#/]',
    '[/&礼物#/]',
    '[/&蛋糕#/]',
    '[/&游泳#/]',
    '[/&上#/]',
    '[/&下#/]',
    '[/&左#/]',
    '[/&右#/]',
    '[/&拳头#/]',
    '[/&挥手#/]',
    '[/&OK#/]',
    '[/&棒#/]',
    '[/&差#/]',
    '[/&鼓掌#/]',
    '[/&手影#/]',
    '[/&头冠#/]',
    '[/&天使#/]',
    '[/&外星人#/]',
    '[/&骷髅#/]',
    '[/&服务员#/]',
    '[/&打针#/]',
    '[/&药#/]',
    '[/&戒指#/]',
    '[/&钻石#/]',
    '[/&心碎#/]',
    '[/&强壮#/]',
    '[/&蒙眼#/]',
    '[/&捂耳朵#/]',
    '[/&捂嘴巴#/]',
    '[/&举手#/]',
    '[/&保佑#/]',
    '[/&男士#/]',
    '[/&女士#/]',
    '[/&卫生间#/]'
];
/**表情code与图片映射 */
export const emojiMap = {
    path: '../../static/emoji/'  /*表情包路径*/,
    map: {  
        '[/&哈哈#/]': '1.png',
        '[/&戴口罩#/]': '2.png',
        '[/&呲牙#/]': '3.png',
        '[/&大笑#/]': '4.png',
        '[/&微笑#/]': '5.png',
        '[/&开心#/]': '6.png',
        '[/&紧张#/]': '7.png',
        '[/&闭眼#/]': '8.png',
        '[/&蒙圈#/]': '9.png',
        '[/&眨眼#/]': '10.png',
        '[/&害羞#/]': '11.png',
        '[/&馋嘴#/]': '12.png',
        '[/&思考#/]': '13.png',
        '[/&喜欢#/]': '14.png',
        '[/&得意#/]': '15.png',
        '[/&假笑#/]': '16.png',
        '[/&不高兴#/]': '17.png',
        '[/&不开心#/]': '18.png',
        '[/&鄙视#/]': '19.png',
        '[/&紧张#/]': '20.png',
        '[/&困#/]': '21.png',
        '[/&不屑#/]': '22.png',
        '[/&困惑#/]': '23.png',
        '[/&嘟嘴#/]': '24.png',
        '[/&飞吻#/]': '25.png',
        '[/&亲嘴#/]': '26.png',
        '[/&爱你#/]': '27.png',
        '[/&调皮#/]': '28.png',
        '[/&鬼脸#/]': '29.png',
        '[/&失望#/]': '30.png',
        '[/&难过#/]': '31.png',
        '[/&生气#/]': '32.png',
        '[/&愤怒#/]': '33.png',
        '[/&哭泣#/]': '34.png',
        '[/&气愤#/]': '35.png',
        '[/&不明白#/]': '36.png',
        '[/&害怕#/]': '37.png',
        '[/&叹气#/]': '38.png',
        '[/&大哭#/]': '39.png',
        '[/&冷汗#/]': '40.png',
        '[/&惊恐#/]': '41.png',
        '[/&不敢看#/]': '42.png',
        '[/&发呆#/]': '43.png',
        '[/&睡觉#/]': '44.png',
        '[/&恶魔#/]': '45.png',
        '[/&不#/]': '46.png',
        '[/&高兴#/]': '47.png',
        '[/&握拳#/]': '48.png',
        '[/&布#/]': '49.png',
        '[/&手势#/]': '50.png',
        '[/&爱心#/]': '51.png',
        '[/&秘密#/]': '52.png',
        '[/&中国#/]': '53.png',
        '[/&德国#/]': '54.png',
        '[/&西班牙#/]': '55.png',
        '[/&法国#/]': '56.png',
        '[/&英国#/]': '57.png',
        '[/&意大利#/]': '58.png',
        '[/&日本#/]': '59.png',
        '[/&韩国#/]': '60.png',
        '[/&俄罗斯#/]': '61.png',
        '[/&美国#/]': '62.png',
        '[/&衰#/]': '63.png',
        '[/&阳光#/]': '64.png',
        '[/&面#/]': '65.png',
        '[/&礼物#/]': '66.png',
        '[/&蛋糕#/]': '67.png',
        '[/&游泳#/]': '68.png',
        '[/&上#/]': '69.png',
        '[/&下#/]': '70.png',
        '[/&左#/]': '71.png',
        '[/&右#/]': '72.png',
        '[/&拳头#/]': '73.png',
        '[/&挥手#/]': '74.png',
        '[/&OK#/]': '75.png',
        '[/&棒#/]': '76.png',
        '[/&差#/]': '77.png',
        '[/&鼓掌#/]': '78.png',
        '[/&手影#/]': '79.png',
        '[/&头冠#/]': '80.png',
        '[/&天使#/]': '81.png',
        '[/&外星人#/]': '82.png',
        '[/&骷髅#/]': '83.png',
        '[/&服务员#/]': '84.png',
        '[/&打针#/]': '85.png',
        '[/&药#/]': '86.png',
        '[/&戒指#/]': '87.png',
        '[/&钻石#/]': '88.png',
        '[/&心碎#/]': '89.png',
        '[/&强壮#/]': '90.png',
        '[/&蒙眼#/]': '91.png',
        '[/&捂耳朵#/]': '92.png',
        '[/&捂嘴巴#/]': '93.png',
        '[/&举手#/]': '94.png',
        '[/&保佑#/]': '95.png',
        '[/&男士#/]': '96.png',
        '[/&女士#/]': '97.png',
        '[/&卫生间#/]': '98.png'
    }  
};
/**发送消息模板 */
export const sendMessageTpl = (time, name, logo, content) => {
    return `<div class="msg-box">
        <div class="send-time on-send">[${time}] ${name}</div>
        <div class="send-msg">
            <div class="logo"><img src="${logo}"/></div>
            <div class="ivu-poptip-popper" style="will-change: top, left;" x-placement="left-start">
                <div class="ivu-poptip-content">
                    <div class="ivu-poptip-arrow"></div> <!----> 
                    <div class="ivu-poptip-inner">
                        <div class="ivu-poptip-body">
                            <div class="ivu-poptip-body-content">
                                <div class="ivu-poptip-body-content-inner">${content}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>`
}

/**接收消息模板 */
export const receiveMessageTpl = (time, name, logo, content) => {
    return `<div class="msg-box">
        <div class="send-time on-send receive">[${time}] ${name}</div>
        <div class="send-msg">
            <div class="logo receive"><img src="${logo}"/></div>
            <div class="ivu-poptip-popper receive" style="will-change: top, left;" x-placement="right-start">
                <div class="ivu-poptip-content">
                    <div class="ivu-poptip-arrow"></div> <!----> 
                    <div class="ivu-poptip-inner">
                        <div class="ivu-poptip-body">
                            <div class="ivu-poptip-body-content">
                                <div class="ivu-poptip-body-content-inner">${content}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>`
}

export const menuIcons = {
    kfgzt : 'ionic',
    qxgl : 'arrow-up-a',
    xtsz : 'arrow-shrink',
    qdgl: 'log-in',
    kfgl : 'ionic',
    sjtj : 'arrow-up-a',
    khzx : 'arrow-shrink'
}