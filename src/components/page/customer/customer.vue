<template>
    <div class="wrap">
        <div>
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>
                    基础资料
                </el-breadcrumb-item>
                <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search">
            <el-input class="input" v-model="searchInfo.customerName" size="small" placeholder="姓名"></el-input>
            <el-button class="m-left20" size="small" type="primary" icon="el-icon-search" @click="triggerSearch">搜索</el-button>
            <el-button class="m-left20" size="small" type="primary" @click="handleAdd">新增</el-button>
        </div>
        <el-table :data="tableData" border max-height="500" :cell-style="{padding:'3px 0'}">
            <el-table-column label="序号" width="70" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="name" label="姓名"  align="center" ></el-table-column>
            <el-table-column prop="phone" label="手机"  align="center" ></el-table-column>
            <el-table-column prop="address" label="地址"  align="center" ></el-table-column>
            <el-table-column prop="iDCardNo" label="身份证号码"  align="center" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间"  align="center" ></el-table-column>
            <el-table-column  label="操作" align="center">
                <template scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="createBorrow">创建贷款</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class = "page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="searchInfo.count"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_count">
        </el-pagination>

        <el-dialog title="新增客户" :visible.sync="addItemDialog" center>
            <el-form :model="newItem" :rules="rules" ref="newItem" :label-position="'right'" label-width="150px" inline-message>

                <el-form-item size="small" label="姓名" prop="name" >
                    <el-input v-model="newItem.name" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="手机" prop="phone" >
                    <el-input v-model="newItem.phone" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="地址" prop="address" >
                    <el-input v-model="newItem.address" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="身份证号" prop="iDCardNo" >
                    <el-input v-model="newItem.iDCardNo" class="row"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" align='center'>
                <el-button size="small" type="primary" @click="saveItem('newItem')">确 定</el-button>
                <el-button size="small" @click="addItemDialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改信息" :visible.sync="editItemDialog">
            <el-form :model="editItem" :rules="rules" ref="editItem" :label-position="'right'" label-width="150px" inline-message>

                <el-form-item size="small" label="姓名" prop="name" >
                    <el-input v-model="editItem.name" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="手机" prop="phone" >
                    <el-input v-model="editItem.phone" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="地址" prop="address" >
                    <el-input v-model="editItem.address" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="身份证号" prop="iDCardNo" >
                    <el-input v-model="editItem.iDCardNo" class="row"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" align='center'>
                <el-button size="small" type="primary" @click="updateItem('editItem')">确 定</el-button>
                <el-button size="small" @click="editItemDialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="贷款信息" :visible.sync="createBorrowDialog">
            <el-form :model="borrowInfo" :rules="rules" ref="borrowInfo" :label-position="'right'" label-width="120px" inline-message>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left"  label="公司" prop="" >
                            <el-input v-model="borrowInfo.name" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right"  label="姓名" prop="" >
                            <el-input v-model="borrowInfo.phone" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="手机" prop="" >
                            <el-input v-model="borrowInfo.name" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="贷款日期" prop="" >
                            <el-input v-model="borrowInfo.phone" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="贷款金额" prop="" >
                            <el-input v-model="borrowInfo.name" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="期数" prop="" >
                            <el-input v-model="borrowInfo.phone" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="周期" prop="" >
                            <el-input v-model="borrowInfo.name" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="每期应还本金" prop="" >
                            <el-input v-model="borrowInfo.phone" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="每期应还利息" prop="" >
                            <el-input v-model="borrowInfo.name" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="保证金" prop="" >
                            <el-input v-model="borrowInfo.phone" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="服务费" prop="" >
                            <el-input v-model="borrowInfo.name" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="家访费" prop="" >
                            <el-input v-model="borrowInfo.phone" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="诉讼费" prop="" >
                            <el-input v-model="borrowInfo.name" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="其他费用" prop="" >
                            <el-input v-model="borrowInfo.phone" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item size="small" class="label-left" label="备注" prop="" >
                            <el-input type="textarea" v-model="borrowInfo.phone" style="width: 88%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer" align='center'>
                <el-button size="small" type="primary" @click="saveBorrowInfo('borrowInfo')">确 定</el-button>
                <el-button size="small" @click="createBorrowDialog = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageNo :1,
                total_count:50,
                searchInfo:{
                    pageNo:0,
                    count:10,
                    customerName:''
                },
                tableData:[],
                newItem:{},
                editItem:{},
                borrowInfo:{},
                tmpRow:null,
                addItemDialog:false,
                editItemDialog:false,
                createBorrowDialog:false,
                rules:{
                    name:[
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    phone:[
                        { validator: utils.regExp.validatePhone, trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            this.search();
        },
        methods: {
            handleSizeChange(val){
                this.searchInfo.count = val;
                this.pageNo = 1;
            },
            handleCurrentChange(val){
                this.pageNo = val;
                this.searchInfo.pageNo = val - 1;
                this.search();
            },
            resetForm(formName) {
                if( typeof this.$refs[formName]!= 'undefined'  && typeof this.$refs[formName].resetFields == 'function' ){
                    this.$refs[formName].resetFields();
                }
            },
            triggerSearch(){
                if(this.pageNo == 1){
                    this.search();
                }else{
                    this.pageNo = 1;
                }
            },
            search(){
                let self = this;
                resource.customerList(this.searchInfo,function(result){
                    if(result.code==200){
                        self.tableData = result.data.list;
                        self.total_count = result.data.total_count;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            handleAdd(){
                this.resetForm('newItem');
                this.addItemDialog = true;
            },
            saveItem(formName){
                var self = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        resource.customerAdd(self.newItem,function(result){
                            if(result.code==200){
                                self.$message({
                                    message: result.msg,
                                    type: 'success'
                                });
                                self.addItemDialog = false;
                            }else{
                                self.$message.error(result.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleEdit(index, row){
                this.tmpRow = row;
                this.editItem = {
                    id:row.id,
                    name:row.name,
                    phone:row.phone,
                    address:row.address
                };
                this.resetForm('editItem');
                this.editItemDialog = true;
            },
            updateItem(formName){
                let self = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        resource.customerUpdate(self.editItem,function(result){
                            if(result.code==200){
                                utils.propertyExtend(self.editItem,self.tmpRow);
                                self.$message({
                                    message: result.msg,
                                    type: 'success'
                                });
                                self.editItemDialog = false;
                            }else{
                                self.$message.error(result.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            deleteItem(index, row){
                var self = this;
                this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resource.customerDel({id:row.id},function(result){
                        if(result.code==200){
                            self.$message({
                                message: result.msg,
                                type: 'success'
                            });
                        }else{
                            self.$message.error(result.msg);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            createBorrow(){
                this.resetForm('borrowInfo');
                this.borrowInfo = {};
                this.createBorrowDialog = true;
            },
            saveBorrowInfo(formName){
                var self = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        resource.customerAdd(self.borrowInfo,function(result){
                            if(result.code==200){
                                self.$message({
                                    message: result.msg,
                                    type: 'success'
                                });
                                self.createBorrowDialog = false;
                            }else{
                                self.$message.error(result.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .search{
        margin:15px 0;
    }
    .input{
        width:180px;
    }
    .row{
        width:80%;
    }
    .label-left{
        margin-left: 30px;
    }
    .label-right{
        margin-right: 30px;
    }
</style>
