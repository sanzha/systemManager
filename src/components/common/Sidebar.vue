<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes"
                 background-color="#324157"
                 text-color="#bfcbd9"
                 active-text-color="#20a0ff"
                 class="el-menu-vertical-demo"
                 theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon + ' grey'"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon  + ' grey'"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'readme',
                        title: '首页'
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '基础资料',
                        subs: [
                            {
                                index: 'customer',
                                title: '客户管理'
                            },
                            {
                                index: 'user',
                                title: '员工管理'
                            },
                            {
                                index: 'organization',
                                title: '组织管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-mobile-phone',
                        index: '3',
                        title: '业务管理',
                        subs: [
                            {
                                index: 'loans',
                                title: '贷款管理'
                            },{
                                index: 'repayment',
                                title: '还款管理'
                            },{
                                index: 'deposit',
                                title: '保证金管理'
                            },{
                                index: 'commission',
                                title: '佣金管理'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-message',
                        index: '4',
                        title: '即时消息',
                        subs:[
                            {
                                index: 'message',
                                title: '短信消息'
                            },{
                                index: 'wechat',
                                title: '微信消息'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-document',
                        index: 'statement',
                        title: '报表管理',
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
    .grey{
        color:#bfcbd9
    }
</style>
