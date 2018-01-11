<template>
    <div class="wrap">
        <div>
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>
                    客户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>客户档案</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search">
            <el-input class="input" v-model="searchInfo.customerName" size="small" placeholder="姓名" clearable></el-input>
            <span class="search-label m-left20">业务员</span>
            <el-select v-model="searchInfo.userId" size="small" filterable  clearable placeholder="业务员">
                <el-option
                    v-for="item in salesmanDictList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button class="m-left20" size="small" type="primary" icon="el-icon-search" @click="triggerSearch">搜索</el-button>
            <el-button class="m-left20" size="small" type="primary" @click="handleAdd">新增</el-button>
        </div>
        <el-table :data="tableData" border max-height="500" :cell-style="{padding:'3px 0'}">
            <el-table-column label="序号" width="70" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="name" label="姓名" width="90" align="center" ></el-table-column>
            <el-table-column prop="phone" label="手机" width="120" align="center" ></el-table-column>
            <el-table-column prop="address" label="地址" width="180" align="center" ></el-table-column>
            <el-table-column prop="iDCardNo" label="身份证号码" width="180" align="center" ></el-table-column>
            <el-table-column prop="bank" label="开户行" width="120" align="center" ></el-table-column>
            <el-table-column prop="bankAccount" label="银行账号" width="180" align="center" ></el-table-column>
            <el-table-column prop="salesman.name" label="业务员" width="160"  align="center" ></el-table-column>
            <el-table-column prop="mark" label="备注" width="200"  align="center" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="120" align="center" ></el-table-column>
            <el-table-column  label="操作" width="180" align="center" fixed="right">
                <template scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="createBorrow(scope.$index, scope.row)">创建贷款</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class = "page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[50, 100, 200, 500, 1000]"
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

                <el-form-item size="small" label="身份证号">
                    <el-input v-model="newItem.iDCardNo" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="开户行">
                    <el-input v-model="newItem.bank" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="银行账号">
                    <el-input v-model="newItem.bankAccount" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="业务员">
                    <el-select v-model="newItem.userId" size="small" class="row" filterable  clearable placeholder="业务员">
                        <el-option
                            v-for="item in salesmanDictList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item size="small" label="openid">
                    <el-input v-model="newItem.openid" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="备注">
                    <el-input v-model="newItem.mark" class="row" type="textarea"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" align='center'>
                <el-button size="small" type="primary" @click="saveItem('newItem')">确 定</el-button>
                <el-button size="small" @click="addItemDialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改信息" :visible.sync="editItemDialog" center>
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

                <el-form-item size="small" label="身份证号">
                    <el-input v-model="editItem.iDCardNo" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="开户行">
                    <el-input v-model="editItem.bank" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="银行账号">
                    <el-input v-model="editItem.bankAccount" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="业务员">
                    <el-select v-model="editItem.userId" size="small" class="row" filterable  clearable placeholder="业务员">
                        <el-option
                            v-for="item in salesmanDictList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item size="small" label="openid">
                    <el-input v-model="editItem.openid" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="备注">
                    <el-input v-model="editItem.mark" class="row" type="textarea"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" align='center'>
                <el-button size="small" type="primary" @click="updateItem('editItem')">确 定</el-button>
                <el-button size="small" @click="editItemDialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="贷款信息" :visible.sync="createBorrowDialog" center>
            <el-form :model="borrowInfo" :rules="rules" ref="borrowInfo" :label-position="'right'" label-width="120px" inline-message>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" label="公司" prop="companyId" >
                            <el-select class="row" v-model="borrowInfo.companyId" size="small" placeholder="请选择">
                                <el-option
                                    v-for="item in companies"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right"  label="姓名" prop="" >
                            <el-input v-model="borrowInfo.name" class="row" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="手机" prop="" >
                            <el-input v-model="borrowInfo.phone" class="row" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="贷款日期" prop="loanDate" >
                            <!--<el-input v-model="borrowInfo.loanDate" class="row"></el-input>-->
                            <el-date-picker
                                :editable="false"
                                value-format="yyyy-MM-dd"
                                clearable
                                class="frame"
                                v-model="borrowInfo.loanDate"
                                type="date"
                                size="small"
                                placeholder="贷款日期"
                                style="width: 80%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="贷款金额" prop="amount" >
                            <el-input type="number" v-model="borrowInfo.amount" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="期数" prop="periods" >
                            <el-input type="number" v-model="borrowInfo.periods" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="周期(天)" prop="period" >
                            <el-input type="number" v-model="borrowInfo.period" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="每期应还本金">
                            <el-input type="number" v-model="eachPrincipal" class="row" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="每期应还利息" prop="eachInterest" >
                            <el-input type="number" v-model="borrowInfo.eachInterest" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="保证金" prop="" >
                            <el-input type="number" v-model="borrowInfo.bail" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="服务费" prop="" >
                            <el-input type="number" v-model="borrowInfo.serviceCharge" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="家访费" prop="" >
                            <el-input type="number" v-model="borrowInfo.visitCharge" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="诉讼费" prop="" >
                            <el-input type="number" v-model="borrowInfo.lawCharge" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" class="label-right" label="其他费用" prop="" >
                            <el-input type="number" v-model="borrowInfo.otherCharge" class="row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>



                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item size="small" class="label-left" label="业务员">
                            <el-select v-model="borrowInfo.userId" size="small" class="row" filterable :disabled="true"  clearable placeholder="业务员">
                                <el-option
                                    v-for="item in salesmanDictList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item size="small" class="label-left" label="备注" prop="" >
                            <el-input type="textarea" v-model="borrowInfo.mark" style="width: 88%"></el-input>
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
                    pageNo:1,
                    count:50,
                    customerName:'',
                    userId:''
                },
                tableData:[],
                salesmanList:[],    //业务员列表
                companies:utils.lsp.get('organizationList'),
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
                    ],
                    period:[
                        { required: true, message: '请输入周期', trigger: 'blur' }
                    ],
                    periods:[
                        { required: true, message: '请输入期数', trigger: 'blur' }
                    ],
                    companyId:[
                        { required: true, message: '请选择公司', trigger: 'change' }
                    ],
                    loanDate:[
                        { required: true, message: '请输入贷款日期', trigger: 'blur' }
                    ],
                    amount:[
                        { required: true, message: '请输入贷款金额', trigger: 'blur' }
                    ],
                    eachInterest:[
                        { required: true, message: '请输入每期应还利息', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            this.getDict();
        },
        computed:{
            salesmanDictList(){
                let result = [];
                this.salesmanList.forEach(function (item,index,arr) {
                    let obj = {
                        id:item.id,
                        name:item.name + "(" + item.phone + ")"
                    };
                    result.push(obj);
                });
                return result;
            },
            eachPrincipal(){
                return this.borrowInfo.amount && this.borrowInfo.periods ? Number(this.borrowInfo.amount/this.borrowInfo.periods).toFixed(2) : '';
            }
        },
        methods: {
            handleSizeChange(val){
                this.searchInfo.count = val;
                this.triggerSearch();
            },
            handleCurrentChange(val){
                this.pageNo = val;
                this.searchInfo.pageNo = val;
                this.search();
            },
            resetForm(formName) {
                if( typeof this.$refs[formName]!= 'undefined'  && typeof this.$refs[formName].resetFields == 'function' ){
                    this.$refs[formName].resetFields();
                }
            },
            getDict(){
                var self = this;
                const p1 = new Promise(function(resolve, reject) {
                    resource.userList({

                    },function(result){
                        if(result.code==200){
                            resolve(result);
                        }else{
                            reject(result);
                        }
                    });
                });
                p1.then(function(json) {
                    self.salesmanList = json.data;
                    self.search();
                }, function(json) {
                    self.$message.error(json.msg);
                });
            },
            triggerSearch(){
                if(this.pageNo == 1){
                    this.search();
                }else{
                    this.pageNo = 1;
                }
            },
            search(){
                const self = this;
                resource.customerList(this.searchInfo,function(result){
                    if(result.code==200){
                        self.tableData = result.data.list;
                        self.tableData.forEach(function (item,index,arr) {
                            item.salesman = utils.convertDict(item.userId,self.salesmanDictList);
                            item.createTime = item.createTime.substring(0,10);
                        });
                        self.total_count = result.data.total_count;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            handleAdd(){
                this.resetForm('newItem');
                this.addItemDialog = true;
                this.newItem = {};
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
                                self.search();
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
                    address:row.address,
                    iDCardNo:row.iDCardNo,
                    bank:row.bank,
                    bankAccount:row.bankAccount,
                    userId:row.salesman.id,
                    openid:row.openid,
                    mark:row.mark
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
                                self.$message({
                                    message: result.msg,
                                    type: 'success'
                                });
                                self.editItemDialog = false;
                                self.search();
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
                            self.search();
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
            createBorrow(index, row){
                this.resetForm('borrowInfo');
                this.borrowInfo = {
                    name:row.name,
                    phone:row.phone,
                    customerId:row.id,
                    userId:row.salesman.id,
                    period:7
                };
                this.createBorrowDialog = true;
            },
            saveBorrowInfo(formName){
                var self = this;
                this.borrowInfo.eachPrincipal = this.eachPrincipal;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        resource.loanAdd(self.borrowInfo,function(result){
                            if(result.code==200){
                                self.$message({
                                    message: result.msg,
                                    type: 'success'
                                });
                                self.createBorrowDialog = false;
                                self.$router.push('/business/loans');
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
