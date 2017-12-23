<template>
    <div class="wrap">
        <div>
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>
                    客户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <p class="number">客户管理：<span v-text="recordsTotal"></span></p>
        <el-table :data="tableData" border max-height="500" :cell-style="{padding:'3px 0'}">
            <el-table-column label="序号" width="70" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="name" label="姓名"  align="center" ></el-table-column>
            <el-table-column prop="name" label="手机"  align="center" ></el-table-column>
            <el-table-column prop="name" label="地址"  align="center" ></el-table-column>
            <el-table-column prop="name" label="身份证号码"  align="center" ></el-table-column>
            <el-table-column prop="name" label="创建时间"  align="center" ></el-table-column>
            <el-table-column  label="操作" align="center">
                <template scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">创建借款</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                recordsTotal:500,
                tableData:[
                    {}
                ]

            }
        },
        created(){
        },
        methods: {
            search(){
                let self = this;
                // if(process.env.NODE_ENV === 'development'){
                //     self.url = '/ms/table/list';
                // };

                // resource.vuetable({
                //     a:1
                // },function (result) {
                //     self.tableData = result.list;
                // });

                mock.tableList(function(result){
                    self.tableData = result.data;
                })

            }

        }
    }
</script>

<style scoped>
    .number{
        margin: 20px 0;
        color: #8492A6;
    }
</style>
