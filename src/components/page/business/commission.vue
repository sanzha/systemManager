<template>
    <div class="wrap">

        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                业务管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>佣金管理</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="search">
            <span class="search-label">公司</span>
            <el-select class="frame" v-model="searchInfo.companyId" size="small" placeholder="全部" clearable>
                <el-option
                    v-for="item in organizationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
            </el-select>
            <span class="search-label">姓名</span>
            <el-input class="frame" v-model="searchInfo.customerName" size="small" placeholder="姓名" clearable></el-input>
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
        </div>

        <el-table :data="tableData" border max-height="500" :cell-style="{padding:'3px 0'}">
            <el-table-column label="序号" width="50" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="company.name" label="公司" width="150"  align="center" ></el-table-column>
            <el-table-column prop="customerName" label="姓名" width="90" align="center" ></el-table-column>
            <el-table-column prop="phone" label="手机" width="110" align="center" ></el-table-column>
            <el-table-column prop="salesman.name" label="业务员"  width="160" align="center" ></el-table-column>
            <el-table-column prop="remark" label="借款摘要" width="220" align="center" ></el-table-column>
            <el-table-column prop="commision" label="佣金"  align="center" ></el-table-column>
            <el-table-column prop="returnCommision" label="待发佣金"  align="center" ></el-table-column>
            <el-table-column prop="returnedCommision" label="已发佣金"  align="center" ></el-table-column>
            <el-table-column prop="incomeCommision" label="扣除佣金"  align="center" ></el-table-column>
            <el-table-column prop="mark" label="备注" width="220" align="center" ></el-table-column>
            <el-table-column prop="stateLabel" label="状态"  align="center" ></el-table-column>
            <el-table-column prop="sureTime" label="确认时间" width="100" align="center" ></el-table-column>
            <el-table-column  label="操作"  align="center" width="150" fixed="right">
                <template scope="scope">
                    <el-button type="text" size="small" v-bind:class=" scope.row.state == 0 ? '' : 'grey' " @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" v-bind:class=" scope.row.returnCommision == 0 && scope.row.state == 0 ? '' : 'grey' " @click="confirmHandle(scope.$index, scope.row)">
                        <span v-text="scope.row.state == 0 ? '确认还款' : '取消确认'"></span>
                    </el-button>
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

        <el-dialog title="佣金信息" :visible.sync="editItemDialog" center>
            <el-form :model="editItem" :rules="rules" ref="editItem" :label-position="'right'" label-width="150px" inline-message>

                <el-form-item size="small" label="业务员">
                    <el-select v-model="editItem.userId" size="small" class="row" filterable :disabled="true" clearable placeholder="业务员">
                        <el-option
                            v-for="item in salesmanDictList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item size="small" label="佣金">
                    <el-input v-model="editItem.commision" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="待发佣金">
                    <el-input :value="returnCommision" class="row" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item size="small" label="已发佣金">
                    <el-input type="number" v-model="editItem.returnedCommision" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="扣除佣金">
                    <el-input type="number" v-model="editItem.incomeCommision" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="备注">
                    <el-input v-model="editItem.mark" class="row" type="textarea"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button size="small" type="primary" @click="updateItem('editItem')">确 定</el-button>
                <el-button size="small" @click="editItemDialog = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                pageNo :1,
                total_count:null,
                searchInfo:{
                    pageNo:1,
                    count:10,
                    customerName:'',
                    companyId:'',
                    userId:''
                },
                tableData:[],
                salesmanList:[],    //业务员列表
                organizationList:utils.lsp.get('organizationList'),
                editItem:{},
                optionList:[],
                editItemDialog:false,
                rules:{}
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
            returnCommision(){
                return this.editItem.commision - this.editItem.returnedCommision - this.editItem.incomeCommision;
            }
        },
        methods:{
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
            search(){
                let self = this;
                resource.commisionbillList(this.searchInfo,function(result){
                    if(result.code==200){
                        self.tableData = result.data.list;
                        self.total_count = result.data.total_count;
                        self.tableData.forEach(function (item,index,arr) {
                            item.salesman = utils.convertDict(item.userId,self.salesmanDictList);
                            item.company = utils.convertDict(item.companyId,self.organizationList);
                            item.loanDate = item.loanDate?item.loanDate.substring(0,10):'';
                            item.stateLabel = item.state?'已确认':'未确认';
                            item.sureTime = item.sureTime?item.sureTime.substring(0,10):'';
                        });
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            handleEdit(index, row){
                this.tmpRow = row;
                this.editItem = {
                    id:row.id,
                    commision:row.commision,
                    userId:row.userId,
                    returnCommision:row.returnCommision,
                    returnedCommision:row.returnedCommision,
                    incomeCommision:row.incomeCommision,
                    mark:row.mark
                };
                this.resetForm('editItem');
                this.editItemDialog = true;
            },
            updateItem(formName){
                let self = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        self.editItem.returnCommision = self.returnCommision;
                        resource.commisionbillUpdate(self.editItem,function(result){
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
            confirmHandle(index, row){
                if (row.returnCommision != 0) return;
                let str = '是否确认佣金处理?';
                if(row.state==1) str = '是否取消佣金确认处理?';
                var self = this;
                this.$confirm(str, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resource.commisionbillHandle({
                        id:row.id
                    },function(result){
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
                    self.$message({
                        type: 'info',
                        message: '已取消处理'
                    });
                });
            }
        }
    }
</script>
<style>
    .row{
        width: 80%;
    }
</style>
