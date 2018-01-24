<template>
    <div class="wrap">
        <div>
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>
                    业务管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>还款管理</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="search">
                <span class="search-label">公司</span>
                <el-select v-model="searchInfo.companyId" class="frame" size="small" clearable placeholder="全部">
                    <el-option
                        v-for="item in organizationList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <span class="search-label">还款时间</span>
                <el-date-picker
                    class="frame"
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    v-model="searchInfo.startDate"
                    type="date"
                    size="small"
                    placeholder="开始时间">
                </el-date-picker>
                <span>-</span>
                <el-date-picker
                    class="frame"
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    v-model="searchInfo.endDate"
                    type="date"
                    size="small"
                    placeholder="结束时间">
                </el-date-picker>
                <div class="m-top10">
                    <span class="search-label m-left0">姓名</span>
                    <el-input class="input" v-model="searchInfo.customerName" size="small" placeholder="姓名"></el-input>
                    <span class="search-label m-left0">状态</span>
                    <el-select v-model="searchInfo.state" class="frame" clearable size="small" placeholder="全部">
                        <el-option
                            v-for="item in statusList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-button size="small" class="search-btn" type="primary" icon="el-icon-search" @click="triggerSearch">搜索</el-button>
                </div>
            </div>
        </div>

        <el-table :data="tableData"
                  show-summary
                  :summary-method="getSummaries"
                  border
                  max-height="450"
                  :cell-style="{padding:'3px 0'}"
                  @selection-change="handleSelectionChange">

            <el-table-column
                type="selection"
                width="55">
            </el-table-column>

            <el-table-column label="序号" width="50" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="company.name" label="公司" width="150"  align="center" ></el-table-column>
            <el-table-column prop="customerName" label="姓名" width="80"  align="center" ></el-table-column>
            <el-table-column prop="phone" label="手机" width="150"  align="center" ></el-table-column>
            <el-table-column prop="remark" label="借款摘要" width="280"  align="center" ></el-table-column>
            <el-table-column prop="returnDate" label="应还日期" width="100"  align="center" ></el-table-column>
            <el-table-column prop="returnPrincipal" label="应还本金"  align="center" ></el-table-column>
            <el-table-column prop="returnInterest" label="应还利息"  align="center" ></el-table-column>
            <el-table-column prop="otherCharge" label="其它应还费用" width="150" align="center" ></el-table-column>
            <el-table-column prop="totalCharge" label="合计" width="150"  align="center" ></el-table-column>
            <el-table-column prop="mark" label="备注" width="220"  align="center" ></el-table-column>
            <el-table-column prop="stateLabel" label="状态"  align="center" ></el-table-column>
            <el-table-column prop="sureTime" label="确认时间" width="100"  align="center" ></el-table-column>
            <el-table-column  label="操作" width="120" align="center" fixed="right">
                <template scope="scope">
                    <el-button type="text" v-bind:class=" scope.row.state == 0 ? '' : 'grey' " size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" v-bind:class=" scope.row.state == 0 ? '' : 'grey' " @click="confirmRepayment(scope.$index, scope.row)">确认还款</el-button>
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

        <el-dialog title="还款信息" :visible.sync="editItemDialog" center>
            <el-form :model="editItem" :rules="rules" ref="editItem" :label-position="'right'" label-width="150px" inline-message>

                <el-form-item size="small" label="应还日期" prop="name" >
                    <el-input v-model="editItem.returnDate" class="row" disabled></el-input>
                </el-form-item>

                <el-form-item size="small" label="应还本金"  prop="phone" >
                    <el-input v-model="editItem.returnPrincipal" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="应还利息" prop="address" >
                    <el-input v-model="editItem.returnInterest" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="其他金额" prop="iDCardNo" >
                    <el-input v-model="editItem.otherCharge" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="备注" prop="iDCardNo" >
                    <el-input v-model="editItem.mark" type="textarea" class="row"></el-input>
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
            return{
                pageNo :1,
                total_count:50,
                searchInfo:{
                    pageNo:1,
                    count:50,
                    companyId:'',
                    state:'',
                    startDate:'',
                    endDate:''
                },
                tableData:[],
                multipleSelection:[],
                editItem:{},
                rules:{},
                statusList:[
                    {
                        id:0,
                        name:'未还款'
                    },{
                        id:1,
                        name:'已还款'
                    }
                ],
                organizationList:utils.lsp.get('organizationList'),
                editItemDialog:false
            }
        },
        created(){
            this.search();
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
            handleSelectionChange(val){
                this.multipleSelection = val;
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
                    if([4,11,13].indexOf(index)>=0){
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
                if( this.searchInfo.startDate!='' && this.searchInfo.endDate!= ''
                    && new Date(this.searchInfo.endDate) - new Date(this.searchInfo.startDate) < 0 ){
                    this.$message.error('结束时间需大于开始时间');
                    this.searchInfo.startDate = '';
                    this.searchInfo.endDate = '';
                    return;
                }
                resource.repaymentList(this.searchInfo,function(result){
                    if(result.code==200){
                        self.tableData = result.data.list;
                        self.tableData.forEach(function (item,index,arr) {
                            item.company = utils.convertDict(item.companyId,self.organizationList);
                            item.returnDate = item.returnDate.substring(0,10);
                            item.sureTime = item.sureTime ? item.sureTime.substring(0,10) : '';
                            item.stateLabel = item.state == 1 ? '已还款' : '未还款';
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
                    returnDate:row.returnDate,
                    returnPrincipal:row.returnPrincipal,
                    returnInterest:row.returnInterest,
                    otherCharge:row.otherCharge,
                    mark:row.mark
                };
                this.resetForm('editItem');
                this.editItemDialog = true;
            },
            updateItem(formName){
                let self = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        resource.repaymentUpdate(self.editItem,function(result){
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
            confirmRepayment(index,row){
                if(row.state==1)return;
                let self = this;
                this.$confirm('是否确认还款?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let self = this;
                    resource.repaymentConfirm({
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
                        message: '已取消还款'
                    });
                });
            }
        }
    }
</script>

<style>
    .search .input{
        width: 150px;
        margin-right: 58px;
    }
    .search .search-btn{
        margin-left: 11px;
    }
    .row{
        width:80%;
    }
</style>
