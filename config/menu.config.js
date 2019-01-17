export default {
    topNav: [
        {
            name: '客服工作台',
            enname: 'kfplatform',
            icon: 'laptop'
        },
        {
            name: '权限管理',
            enname: 'authoritymanage',
            icon: 'ios-compose-outline'
        },
        {
            name: '系统设置',
            enname: 'systemconfig',
            icon: 'ios-gear-outline'
        },
        {
            name: '渠道管理',
            enname: 'channelmanage',
            icon: 'ios-compose-outline'
        }, 
        {
            name: '客服管理',
            enname: 'kfmanage',
            icon: 'ios-compose-outline'
        },  
        {
            name: '数据统计',
            enname: 'statics',
            icon: 'md-keypad'
        },
        {
            name: '客户中心',
            enname: 'customercenter',
            icon: 'md-keypad'
        },                                      
    ],
    subMenus: [
        /******客服工作台 */
        {
            name: '会话',
            path: 'session',
            parent: '客服工作台',
            icon: 'ios-stats',
        },
        {
            name: '待接入',
            path: 'waitin',
            parent: '客服工作台',
            icon: 'ios-statics',
        },
        {
            name: '常用语',
            path: 'commonphrase',
            parent: '客服工作台',
            icon: 'ios-statics',
        },
        /**权限管理 */
        {
            name: '租户/机构管理',
            path: 'company',
            parent: '权限管理',
            icon: 'ios-statics',
        },
        {
            name: '角色管理',
            path: 'role',
            parent: '权限管理',
            icon: 'ios-statics',
        },
        {
            name: '客服中心管理',
            path: 'kfcenter',
            parent: '权限管理',
            icon: 'ios-statics',
        },
        /********* 系统设置*/
        {
            name: '企业信息',
            path: 'enterpriseinfo',
            parent: '系统设置',
            icon: 'ios-statics',
        },
        {
            name: '系统开关',
            path: 'systemswitch',
            parent: '系统设置',
            icon: 'ios-statics',
        },
        {
            name: '时间计划',
            path: 'timeplan',
            parent: '系统设置',
            icon: 'ios-statics',
        },
        {
            name: '会话标签',
            path: 'sessiontag',
            parent: '系统设置',
            icon: 'ios-statics',
        },
        {
            name: '会话分配规则',
            path: 'sessionrules',
            parent: '系统设置',
            icon: 'ios-statics',
        },
        /****** 渠道管理 */
        {
            name: 'APP',
            path: 'application',
            parent: '渠道管理',
            icon: 'ios-statics',
        },
        /*****客服管理 */
        {
            name: '客服',
            path: 'kf',
            parent: '客服管理',
            icon: 'ios-statics',
        },
        {
            name: '客服分组',
            path: 'kfgroup',
            parent: '客服管理',
            icon: 'ios-statics',
        },
        /******数据统计 */
        {
            name: '统计概况',
            path: 'summerystatistics',
            parent: '数据统计',
            icon: 'ios-stats',
        },
        {
            name: '访客与对话',
            path: 'visitor',
            parent: '数据统计',
            icon: 'ios-statics',
            // children:[
            //     {
            //         name: '按时段',
            //         path: 'test',
            //     },
            //     {
            //         name: '按日期',
            //         path: '3test3',
            //     },
            //     {
            //         name: '按搜索词',
            //         path: '4test4',
            //     },
            //     {
            //         name: '按着陆页',
            //         path: '5test5',
            //     },
            //     {
            //         name: '按对话页',
            //         path: '6test6',
            //     }
            // ]
        },
        {
            name: '工单统计',
            path: 'orderstatics',
            parent: '数据统计',
            icon: 'ios-statics',
        },
        {
            name: '客服质量',
            path: 'kfquality',
            parent: '数据统计',
            icon: 'ios-statics',
        } ,
         /*****客户中心 */
        {
            name: '客户信息',
            path: 'customer',
            parent: '客户中心',
            icon: 'ios-statics',
        },
        {
            name: '客户标签',
            path: 'customerTags',
            parent: '客户中心',
            icon: 'ios-statics',
        },                                
    ] 
}