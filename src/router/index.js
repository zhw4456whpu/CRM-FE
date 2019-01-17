import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import RemoteLogin from '@/components/login/RemoteLogin'
import ErrorPage from '@/components/login/ErrorPage'
import WarningPage from '@/components/login/ErrorPage'
import Index from '@/components/home/Index'
import Session from '@/components/kfplatform/Session'
import WaitIn from '@/components/kfplatform/WaitIn'
import Test from '@/components/Test'
/**客服工作台 */
import CommonPhrase from '@/components/kfplatform/CommonPhrase'
import Company from '@/components/authoritymanage/Company'
import KFCenter from '@/components/authoritymanage/KFCenter'
import Sensitive from '@/components/authoritymanage/Sensitive'
import Role from '@/components/authoritymanage/Role'
import SubRole from '@/components/authoritymanage/SubRole'
import History from '@/components/kfplatform/SessionHistory'
/**
 * 系统设置
 */
import EnterpriseInfo from '@/components/systemconfig/EnterpriseInfo'
import SessionRules from '@/components/systemconfig/SessionRules'
import SessionTag from '@/components/systemconfig/SessionTag'
import SystemSwitch from '@/components/systemconfig/SystemSwitch'
// import TimePlan from '@/components/systemconfig/TimePlan'
/**渠道管理 */
import Application from '@/components/channelmanage/application'
/**客服管理 */
import KF from '@/components/kfmanage/KF'
import KFGroup from '@/components/kfmanage/KFGroup'
//数据统计
import summerystatistics from '@/components/statics/SummeryStatistics'
import visitor from '@/components/statics/visitor'
import orderstatics from '@/components/statics/orderstatics'
//客户中心
import customer from '@/components/customercenter/customer'
import customerTags from '@/components/customercenter/customerTags'

/**营销数据 */
import odIndex from '@/components/operatedata/index'

/**聊天框 */
import ChatBox from '@/components/common/ChatBox'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login2',
      component: Login
    },
    {
      path:'/index',
      name:'Index',
      component:Index,
      children: [
        {
          path: 'test',
          name: 'Test',
          component: Test
        }
      ]
    },
    /**客服工作台 */
    {
      path: '/kfplatform',
      name: 'KFPlatform',
      component: Index,
      redirect: '/kfplatform/session',
      children: [
        {
          path: 'session',
          name: 'Session',
          component: Session
        },
        {
          path: 'waitin',
          name: 'WaitIn',
          component: WaitIn
        },
        {
          path: 'commonphrase',
          name: 'CommonPhrase',
          component: CommonPhrase
        },{
          path: 'history',
          name: 'History',
          component: History
        },
      ]
    },
    /**权限管理 */
    {
      path: '/authoritymanage',
      name: 'AuthorityManage',
      component: Index,
      redirect: '/authoritymanage/company',
      children: [
        {
          path: 'company',
          name: 'Company',
          component: Company
        },
        {
          path: 'kfcenter',
          name: 'KFCenter',
          component: KFCenter
        },
        {
          path: 'sensitive',
          name: 'Sensitive',
          component: Sensitive
        },        
        {
          path: 'role',
          name: 'Role',
          component: Role
        },
        {
          path: 'subrole',
          name: 'SubRole',
          component: SubRole
        }
      ]
    },
    /**系统设置 */
    {
      path: '/systemconfig',
      name: 'SystemConfig',
      component: Index,
      redirect: '/systemconfig/enterpriseInfo',
      children: [
        {
          path: 'enterpriseInfo',
          name: 'EnterpriseInfo',
          component: EnterpriseInfo
        },
        {
          path: 'systemswitch',
          name: 'SystemSwitch',
          component: SystemSwitch
        },
        // {
        //   path: 'timeplan',
        //   name: 'TimePlan',
        //   component: TimePlan
        // },
        {
          path: 'sessiontag',
          name: 'SessionTag',
          component: SessionTag
        },  
        {
          path: 'sessionrules',
          name: 'SessionRules',
          component: SessionRules
        },
      ]
    },
    /**渠道管理 */
    {
      path: '/channelmanage',
      name: 'ChannelManage',
      component: Index,
      redirect: '/channelmanage/application',
      children: [
        {
          path: 'application',
          name: 'Application',
          component : Application
        }
      ]
    },
    /**客服管理 */
    {
      path: '/kfmanage',
      name: 'KFManage',
      component: Index,
      redirect: '/kfmanage/kf',
      children: [
        {
          path: 'kf',
          name: 'KF',
          component : KF
        },
        {
          path: 'kfgroup',
          name: 'KFGroup',
          component : KFGroup
        },
      ]
    },
    /**客户中心 */
    {
      path: '/customercenter',
      name: 'customercenter',
      component: Index,
      redirect: '/customercenter/customer',
      children: [
        {
          path: 'customer',
          name: 'customer',
          component : customer
        },
        {
          path: 'customerTags',
          name: 'customerTags',
          component : customerTags
        },
      ]
    },
    /**营销数据 */
    {
      path: '/operationdata',
      name: 'OperationData',
      component: Index,
      redirect: '/operationdata/index',
      children: [
        {
          path: 'index',
          name: 'Index',
          component : odIndex
        }
      ]
    }, 
    //数据统计
    {
      path: '/statics',
      name: 'statics',
      component: Index,
      redirect: '/statics/summerystatistics',
      children: [
        {
          path: 'summerystatistics',
          name: 'summerystatistics',
          component : summerystatistics
        },
        {
          path: 'visitor',
          name: 'visitor',
          component : visitor,
          // children:[
          //   {
          //     path: 'test',
          //     name: 'test',
          //     component : test
          //   }
          // ]
        },        
        {
          path: 'orderstatics',
          name: 'orderstatics',
          component : orderstatics
        }        
      ]
    },
    {
      path: '/remotelogin',
      name: 'RemoteLogin',
      component: RemoteLogin
    },
    {
      path: '/warningpage',
      name: 'WarningPage',
      component: WarningPage
    },
    {
      path: '/errorpage',
      name: 'ErrorPage',
      component: ErrorPage
    },
    {
      path: '/chatbox',
      name: 'ChatBox',
      component: ChatBox
    } 
  ]
})
