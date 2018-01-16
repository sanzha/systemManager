<template>
    <div class="wrap">

        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                业务管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>保证金管理</el-breadcrumb-item>
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
            <el-input class="input frame" v-model="searchInfo.customerName" size="small" placeholder="姓名"></el-input>
            <el-button size="small" class="m-left20" type="primary" icon="el-icon-search" @click="triggerSearch">搜索</el-button>
        </div>

        <el-table :data="tableData"
                  :summary-method="getSummaries"
                  show-summary
                  border
                  max-height="500"
                  :cell-style="{padding:'3px 0'}">
            <el-table-column label="序号" width="50" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="company.name" label="公司" width="150"  align="center" ></el-table-column>
            <el-table-column prop="customerName" label="姓名"  align="center" ></el-table-column>
            <el-table-column prop="phone" label="手机" width="110" align="center" ></el-table-column>
            <el-table-column prop="remark" label="借款摘要" width="220" align="center" ></el-table-column>
            <el-table-column prop="bail" label="保证金"  align="center" ></el-table-column>
            <el-table-column prop="returnBail" label="待退金额"  align="center" ></el-table-column>
            <el-table-column prop="returnedBail" label="已退金额"  align="center" ></el-table-column>
            <el-table-column prop="incomeBail" label="转收入金额" width="120" align="center" ></el-table-column>
            <el-table-column prop="mark" label="备注" width="220" align="center" ></el-table-column>
            <el-table-column prop="stateLabel" label="状态"  align="center" ></el-table-column>
            <el-table-column prop="sureTime" width="100" label="确认时间"  align="center" ></el-table-column>
            <el-table-column  label="操作"  align="center" width="120" fixed="right">
                <template scope="scope">
                    <el-button type="text" size="small" v-bind:class=" scope.row.state == 0 ? '' : 'grey' " @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" v-bind:class=" scope.row.returnBail == 0 && scope.row.state == 0 ? '' : 'grey' " @click="confirmHandle(scope.$index, scope.row)">确认处理</el-button>
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

        <el-dialog title="保证金信息" :visible.sync="editItemDialog" center>
            <el-form :model="editItem" :rules="rules" ref="editItem" :label-position="'right'" label-width="150px" inline-message>

                <el-form-item size="small" label="保证金">
                    <el-input :value="editItem.bail" class="row" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item size="small" label="待退金额">
                    <el-input :value="returnBail" class="row" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item size="small" label="已退金额">
                    <el-input type="number" v-model="editItem.returnedBail" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="转收入金额">
                    <el-input type="number" v-model="editItem.incomeBail" class="row"></el-input>
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
                    count:50,
                    customerName:'',
                    companyId:''
                },
                tableData:[{}],
                editItem:{},
                organizationList:utils.lsp.get('organizationList'),
                editItemDialog:false,
                rules:{}
            }
        },
        created(){
            this.search();
        },
        computed:{
            returnBail(){
                let returnedBail = this.editItem.returnedBail ? this.editItem.returnedBail : 0,
                    incomeBail = this.editItem.incomeBail ? this.editItem.incomeBail : 0;
                return this.editItem.bail - returnedBail - incomeBail;
            }
        },
        methods:{
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
            triggerSearch(){
                if(this.pageNo == 1){
                    this.search();
                }else{
                    this.pageNo = 1;
                }
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if([3,9,11].indexOf(index)>=0){
                        sums[index] = '';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    } else {
                        sums[index] = '';
                    }
                });

                return sums;
            },
            search(){
                let self = this;
                resource.bailList(this.searchInfo,function(result){
                    if(result.code==200){
                        self.tableData = result.data.list;
                        self.tableData.forEach(function (item,index,arr) {
                            item.company = utils.convertDict(item.companyId,self.organizationList);
                            item.loanDate = item.loanDate?item.loanDate.substring(0,10):'';
                            item.stateLabel = item.state?'已确认':'未确认';
                            item.sureTime = item.sureTime?item.sureTime.substring(0,10):'';
                        });
                        self.total_count = result.data.total_count;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            handleEdit(index, row){
                if(row.state==1)return;
                this.editItem = {
                    id:row.id,
                    billId:row.billId,
                    remark:row.remark,
                    bail:row.bail,
                    returnBail:row.returnBail,
                    returnedBail:row.returnedBail,
                    incomeBail:row.incomeBail,
                    mark:row.mark
                };
                this.resetForm('editItem');
                this.editItemDialog = true;
            },
            updateItem(formName){
                let self = this;
                this.editItem.returnBail = this.returnBail;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        resource.bailUpdate(self.editItem,function(result){
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
                if(row.returnBail != 0 || row.state != 0)return;
                var self = this;
                this.$confirm('是否完成保证金处理?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resource.bailHandle({
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
