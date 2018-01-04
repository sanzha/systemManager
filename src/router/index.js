import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    //客户管理
                    path: '/customer',
                    component: resolve => require(['../components/common/vessel.vue'], resolve),
                    children:[
                        {
                            path: '',
                            component: resolve => require(['../components/page/customer/customer.vue'], resolve)
                        },{
                            path: 'follow',
                            component: resolve => require(['../components/page/customer/follow.vue'], resolve)
                        },{
                            path: 'credit',
                            component: resolve => require(['../components/page/customer/credit.vue'], resolve)
                        }
                    ]
                },
                {
                    //业务管理
                    path: '/business',
                    component: resolve => require(['../components/common/vessel.vue'], resolve),
                    children:[
                        {
                            path: 'loans',
                            component: resolve => require(['../components/page/business/loans.vue'], resolve)
                        },{
                            path: 'repayment',
                            component: resolve => require(['../components/page/business/repayment.vue'], resolve)
                        },{
                            path: 'deposit',
                            component: resolve => require(['../components/page/business/deposit.vue'], resolve)
                        },{
                            path: 'commission',
                            component: resolve => require(['../components/page/business/commission.vue'], resolve)
                        },{
                            path: 'cashFlow',
                            component: resolve => require(['../components/page/business/cashFlow.vue'], resolve)
                        }
                    ]
                },
                {
                    //即时消息
                    path: '/message',
                    component: resolve => require(['../components/common/vessel.vue'], resolve),
                    children:[
                        {
                            path: 'inner',
                            component: resolve => require(['../components/page/message/inner.vue'], resolve)
                        },{
                            path: 'out',
                            component: resolve => require(['../components/page/message/out.vue'], resolve)
                        }
                    ]
                },
                {
                    //基础资料
                    path: '/base',
                    component: resolve => require(['../components/common/vessel.vue'], resolve),
                    children:[
                        {
                            path: 'organization',
                            component: resolve => require(['../components/page/base/organization.vue'], resolve)
                        },{
                            path: 'user',
                            component: resolve => require(['../components/page/base/user.vue'], resolve)
                        },{
                            path: 'rote',
                            component: resolve => require(['../components/page/base/rote.vue'], resolve)
                        },{
                            path: 'log',
                            component: resolve => require(['../components/page/base/log.vue'], resolve)
                        }
                    ]
                },
                {
                    //报表管理
                    path: '/report',
                    component: resolve => require(['../components/common/vessel.vue'], resolve),
                    children:[
                        {
                            path: 'statement',
                            component: resolve => require(['../components/page/report/statement.vue'], resolve)
                        }
                    ]
                },


            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
