<template>
    <div class="wrap">
        <div>
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>
                    业务管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>贷款管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search">
            <div>
                <span class="search-label">公司</span>
                <el-select v-model="searchInfo.companyId" class="w180" size="small" placeholder="全部" clearable>
                    <el-option
                        v-for="item in organizationList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <span class="search-label">贷款时间</span>
                <el-date-picker
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    clearable
                    class="frame"
                    v-model="searchInfo.startDate"
                    type="date"
                    size="small"
                    placeholder="开始时间">
                </el-date-picker>
                <span>-</span>
                <el-date-picker
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    clearable
                    class="frame"
                    v-model="searchInfo.endDate"
                    type="date"
                    size="small"
                    placeholder="结束时间">
                </el-date-picker>
            </div>

            <div class="m-top10">
                <span class="search-label">姓名</span>
                <el-input class="w180" v-model="searchInfo.customerName" size="small" placeholder="姓名" clearable></el-input>
                <span class="search-label m-left44">业务员</span>
                <el-select v-model="searchInfo.userId" size="small" class="w180" filterable  clearable placeholder="业务员">
                    <el-option
                        v-for="item in salesmanDictList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-button size="small" class="m-left20" type="primary" icon="el-icon-search" @click="triggerSearch">搜索</el-button>
            </div>

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
            <el-table-column prop="phone" label="手机"  width="150" align="center" ></el-table-column>
            <el-table-column prop="amount" label="贷款金额"  align="center" ></el-table-column>
            <el-table-column prop="eachPrincipal" label="每期应还本金" width="150" align="center" ></el-table-column>
            <el-table-column prop="eachInterest" label="每期应还利息" width="150"  align="center" ></el-table-column>
            <el-table-column prop="loanDate" label="贷款时间" width="100"  align="center" ></el-table-column>
            <el-table-column prop="periods" label="期数"  align="center" ></el-table-column>
            <el-table-column prop="period" label="周期(天)"  align="center" ></el-table-column>
            <el-table-column prop="bail" label="保证金"  align="center" ></el-table-column>
            <el-table-column prop="commision" label="佣金"  align="center" ></el-table-column>
            <el-table-column prop="serviceCharge" label="服务费"  align="center" ></el-table-column>
            <el-table-column prop="visitCharge" label="家访费"  align="center" ></el-table-column>
            <el-table-column prop="lawCharge" label="诉讼费"  align="center" ></el-table-column>
            <el-table-column prop="otherCharge" label="其它费用"  align="center" ></el-table-column>
            <el-table-column prop="returnedPrincipal" label="已还本金"  align="center" ></el-table-column>
            <el-table-column prop="returnedInterest" label="已还利息"  align="center" ></el-table-column>
            <el-table-column prop="salesman.name" label="业务员" width="160"  align="center" ></el-table-column>
            <el-table-column  label="操作"  align="center" width="100" fixed="right">
                <template scope="scope">
                    <el-button type="text" size="small" @click="showDetail(scope.$index, scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
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

        <el-dialog width="60%" :visible.sync="detailDialog" center>
            <el-tabs type="border-card">
                <el-tab-pane label="贷款详细">
                    <div class="container">
                        <el-row class="border-top-left">
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>公司:</span>
                                <span v-text="detail.baseInfo.company.name"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>姓名:</span>
                                <span v-text="detail.baseInfo.customerName"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>手机:</span>
                                <span v-text="detail.baseInfo.phone"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>贷款金额:</span>
                                <span v-text="detail.baseInfo.amount"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>期数:</span>
                                <span v-text="detail.baseInfo.periods"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>周期:</span>
                                <span v-text="detail.baseInfo.period"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>每期应还本金:</span>
                                <span v-text="detail.baseInfo.eachPrincipal"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>每期应还利息:</span>
                                <span v-text="detail.baseInfo.eachInterest"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>保证金:</span>
                                <span v-text="detail.baseInfo.bail"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>服务费:</span>
                                <span v-text="detail.baseInfo.serviceCharge"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>家访费:</span>
                                <span v-text="detail.baseInfo.visitCharge"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>诉讼费:</span>
                                <span v-text="detail.baseInfo.lawCharge"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>其它费用:</span>
                                <span v-text="detail.baseInfo.otherCharge"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>已还本金:</span>
                                <span v-text="detail.baseInfo.returnedPrincipal"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>已还利息:</span>
                                <span v-text="detail.baseInfo.returnedInterest"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>业务员:</span>
                                <span v-text="detail.baseInfo.salesman.name"></span>
                            </el-col>
                            <el-col :span="6" class="border-bottom-right cell">
                                <span>佣金:</span>
                                <span v-text="detail.baseInfo.commision"></span>
                            </el-col>
                            <el-col :span="18" class="border-bottom-right cell">
                                <span>备注:</span>
                                <span v-text="detail.baseInfo.mark"></span>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="还款列表">
                    <div class="container">
                        <el-button class="m-bottom10" size="small" type="primary"  @click="handleBatchRrepay">提前还款</el-button>
                        <el-table :data="detail.returnBillList"
                                  :summary-method="getRepaySummaries"
                                  show-summary
                                  border max-height="270"
                                  :cell-style="{padding:'3px 0'}">
                            <el-table-column label="序号" width="50" scope="scope" align="center">
                                <template scope="scope">
                                    <span v-text="scope.$index+1"></span>
                                </template>
                            </el-table-column >
                            <el-table-column prop="remark" label="借款摘要" width="220"  align="center" ></el-table-column>
                            <el-table-column prop="returnDate" label="应还日期" width="100" align="center" ></el-table-column>
                            <el-table-column prop="returnPrincipal" label="应还本金"  align="center" ></el-table-column>
                            <el-table-column prop="returnInterest" label="应还利息"  align="center" ></el-table-column>
                            <el-table-column prop="otherCharge" label="其它应还费用" width="120"  align="center" ></el-table-column>
                            <el-table-column prop="totalCharge" label="合计"  align="center" ></el-table-column>
                            <el-table-column prop="sureTime" label="确认时间" width="100"  align="center" ></el-table-column>
                            <el-table-column prop="stateLabel" label="状态"  align="center" ></el-table-column>
                            <el-table-column prop="mark" width="200" label="备注"  align="center" ></el-table-column>
                            <el-table-column  label="操作" width="120" align="center">
                                <template scope="scope">
                                    <el-button type="text" size="small" v-bind:class=" scope.row.state == 0 ? '' : 'grey' " @click="handleEditRepaymentInfo(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" v-bind:class=" scope.row.state == 0 ? '' : 'grey' "  @click="confirmRepayment(scope.$index, scope.row)">确认还款</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-dialog
                    center
                    width="40%"
                    title="还款信息"
                    :visible.sync="repayInfoDialog"
                    append-to-body>

                    <el-form :model="repayItem" :rules="rules" ref="repayItem" :label-position="'right'" label-width="120px" inline-message>
                        <el-form-item size="small" label="借款摘要"  prop="name" >
                            <el-input v-model="repayItem.remark" :disabled="true" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="应还日期" prop="name" >
                            <el-input v-model="repayItem.returnDate" class="row" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="应还本金" prop="phone" >
                            <el-input v-model="repayItem.returnPrincipal" :disabled="true" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="应还利息" prop="address" >
                            <el-input v-model="repayItem.returnInterest" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="其它应还费用"  prop="iDCardNo" >
                            <el-input v-model="repayItem.otherCharge" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="备注" prop="iDCardNo" >
                            <el-input type="textarea" v-model="repayItem.mark" class="row"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer" align='center'>
                        <el-button size="small" type="primary" @click="saveRepayInfo('repayItem')">确 定</el-button>
                        <el-button size="small" @click="repayInfoDialog = false">取 消</el-button>
                    </div>
                </el-dialog>

                <el-dialog
                    center
                    width="40%"
                    title="提前还款信息"
                    :visible.sync="batchRepaymentInfoDialog"
                    append-to-body>

                    <el-form :model="batchRepaymentInfo" :rules="rules" ref="batchRepaymentInfo" :label-position="'right'" label-width="120px" inline-message>
                        <el-form-item size="small" label="借款摘要"  prop="name" >
                            <el-input v-model="batchRepaymentInfo.remark" :disabled="true" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="应还日期" prop="name" >
                            <el-input v-model="batchRepaymentInfo.returnDate" :disabled="true" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="应还本金" prop="phone" >
                            <el-input v-model="batchRepaymentInfo.returnPrincipal" :disabled="true" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="应还利息" prop="address" >
                            <el-input v-model="batchRepaymentInfo.returnInterest" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="其它应还费用" prop="iDCardNo" >
                            <el-input v-model="batchRepaymentInfo.otherCharge" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="备注" prop="iDCardNo" >
                            <el-input type="textarea" v-model="batchRepaymentInfo.mark" class="row"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer" align='center'>
                        <el-button size="small" type="primary" @click="batchRrepay('repayItem')">确 定</el-button>
                        <el-button size="small" @click="batchRepaymentInfoDialog = false">取 消</el-button>
                    </div>
                </el-dialog>

                <el-tab-pane label="保证金列表">
                    <div class="container">
                        <el-table :data="detail.bailBillList"
                                  border
                                  :cell-style="{padding:'3px 0'}">
                            <el-table-column label="序号" width="50" scope="scope" align="center">
                                <template scope="scope">
                                    <span v-text="scope.$index+1"></span>
                                </template>
                            </el-table-column >
                            <el-table-column prop="remark" label="借款摘要" width="220" align="center" ></el-table-column>
                            <el-table-column prop="bail" label="保证金"  align="center" ></el-table-column>
                            <el-table-column prop="returnBail" label="待退金额"  align="center" ></el-table-column>
                            <el-table-column prop="returnedBail" label="已退金额"  align="center" ></el-table-column>
                            <el-table-column prop="incomeBail" label="转收入金额" width="120"  align="center" ></el-table-column>
                            <el-table-column prop="stateLabel" label="状态"  align="center" ></el-table-column>
                            <el-table-column prop="sureTime" label="确认时间" width="100" align="center" ></el-table-column>
                            <el-table-column prop="mark" label="备注" width="200"  align="center" ></el-table-column>
                            <el-table-column  label="操作" align="center" width="120">
                                <template scope="scope">
                                    <el-button type="text" size="small" v-bind:class=" scope.row.state == 0 ? '' : 'grey' "   @click="handleEditBailInfo(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" v-bind:class=" scope.row.returnBail == 0 && scope.row.state == 0 ? '' : 'grey' "   @click="confirmHandle(scope.$index, scope.row)">确认处理</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-dialog
                    center
                    width="40%"
                    title="保证金信息"
                    :visible.sync="bailInfoDialog"
                    append-to-body>

                    <el-form :model="bailItem" :rules="rules" ref="bailItem" :label-position="'right'" label-width="120px" inline-message>
                        <el-form-item size="small" label="借款摘要" >
                            <el-input v-model="bailItem.remark" :disabled="true" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="保证金" >
                            <el-input :value="bailItem.bail" :disabled="true" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="待退金额" >
                            <el-input :value="returnBail" class="row" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="已退金额" >
                            <el-input type="number" v-model="bailItem.returnedBail" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="转收入金额" >
                            <el-input type="number" v-model="bailItem.incomeBail" class="row"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="备注" >
                            <el-input v-model="bailItem.mark" type="textarea" class="row"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer" align='center'>
                        <el-button size="small" type="primary" @click="saveBailInfo('bailItem')">确 定</el-button>
                        <el-button size="small" @click="bailInfoDialog = false">取 消</el-button>
                    </div>
                </el-dialog>

            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                pageNo :1,
                total_count:50,
                searchInfo:{
                    pageNo:1,
                    count:50,
                    startDate:'',
                    endDate:'',
                    companyId:'',
                    customerName:'',
                    userId:''
                },
                tableData:[],
                salesmanList:[],
                detail:{
                    baseInfo:{
                        company:{},
                        salesman:{}
                    },
                    returnBillList:[],
                    bailBillList:[]
                },
                repayItem:{},   //还款信息
                bailItem:{},    //保证金信息
                batchRepaymentInfo:{},    //提前还款信息
                repayInfoDialog:false,
                bailInfoDialog:false,
                detailDialog:false,
                batchRepaymentInfoDialog:false,
                rules:{

                },
                organizationList:utils.lsp.get('organizationList')
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
            returnBail(){
                let returnedBail = this.bailItem.returnedBail ? this.bailItem.returnedBail : 0,
                    incomeBail = this.bailItem.incomeBail ? this.bailItem.incomeBail : 0;
                return this.bailItem.bail - returnedBail - incomeBail;
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
            summation(columns,data,arr){
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if(arr.indexOf(index)>=0){
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
            getSummaries(param) {
                const { columns, data } = param;
                return this.summation(columns, data, [3,5,6,8,9]);
            },
            getRepaySummaries(param) {
                const { columns, data } = param;
                return this.summation(columns, data, [7]);
            },
            getBailSummaries(param) {
                const { columns, data } = param;
                return this.summation(columns, data, []);
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
                resource.loanList(this.searchInfo,function(result){
                    if(result.code==200){
                        self.tableData = result.data.list;
                        self.tableData.forEach(function (item,index,arr) {
                           item.salesman = utils.convertDict(item.userId,self.salesmanDictList);
                           item.company = utils.convertDict(item.companyId,self.organizationList);
                           item.loanDate = item.loanDate.substring(0,10);
                        });
                        self.total_count = result.data.total_count;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            showDetail(index,row,id){
                let self = this;
                resource.loanDetail({
                    id: id ? id : row.id
                },function(result){
                    if(result.code==200){
                        self.detail.baseInfo = result.data.bill;
                        self.detail.baseInfo.salesman = utils.convertDict(result.data.bill.userId,self.salesmanList);
                        self.detail.baseInfo.company = utils.convertDict(result.data.bill.companyId,self.organizationList);
                        self.detail.returnBillList = result.data.returnBillList;
                        self.detail.returnBillList.forEach(function (item,index,arr) {
                            item.returnDate = item.returnDate.substring(0,10);
                            item.sureTime = item.sureTime ? item.sureTime.substring(0,10) : '';
                            item.stateLabel = item.state == 1 ? '已还款' : '未还款';
                        });
                        self.detail.bailBillList = result.data.bailBillList;
                        self.detail.bailBillList.forEach(function (item,index,arr) {
                            item.stateLabel = item.state?'已确认':'未确认';
                            item.sureTime = item.sureTime?item.sureTime.substring(0,10):'';
                        });
                        if(!id)self.detailDialog = true;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            deleteItem(index, row){
                let self = this;
                this.$confirm('此操作将永久删除该笔借款, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resource.loanDelete({id:row.id},function(result){
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
            handleBatchRrepay(){
                let self = this;
                resource.getBatchRepaymentInfo({
                    billId:this.detail.baseInfo.id
                },function(result){
                    if(result.code==200){
                        self.batchRepaymentInfo = {
                            billId:result.data.billId,
                            remark:result.data.remark,
                            returnDate:result.data.returnDate.substring(0,10),
                            returnPrincipal:result.data.returnPrincipal,
                            returnInterest:result.data.returnInterest,
                            otherCharge:result.data.otherCharge,
                            mark:result.data.mark,
                            createTime:result.data.createTime
                        };
                        self.batchRepaymentInfoDialog = true;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            /**还款列表-提前还款**/
            batchRrepay(){
                var self = this;
                resource.repaymentBatchConfirm(this.batchRepaymentInfo,function (result) {
                    if(result.code==200){
                        self.$message({
                            message: result.msg,
                            type: 'success'
                        });
                        self.showDetail(null,null,self.detail.baseInfo.id);
                        self.batchRepaymentInfoDialog = false;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            /**还款列表-编辑**/
            handleEditRepaymentInfo(index,row){
                if(row.state==1)return;
                this.repayItem = {
                    id:row.id,
                    billId:row.billId,
                    remark:row.remark,
                    returnDate:row.returnDate,
                    returnPrincipal:row.returnPrincipal,
                    returnInterest:row.returnInterest,
                    otherCharge:row.otherCharge,
                    mark:row.mark
                };
                this.repayInfoDialog = true;
            },
            /**还款列表-保存编辑信息**/
            saveRepayInfo(){
                var self = this;
                resource.repaymentUpdate(this.repayItem,function (result) {
                    if(result.code==200){
                        self.$message({
                            message: result.msg,
                            type: 'success'
                        });
                        self.showDetail(null,null,self.repayItem.billId);
                        self.repayInfoDialog = false;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            /**还款列表-确认还款**/
            confirmRepayment(index,row){
                if(row.state==1)return;
                let self = this;
                let billId = row.billId;
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
                            self.showDetail(null,null,billId);
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
            },
            /**保证金列表-编辑**/
            handleEditBailInfo(index,row){
                if(row.state==1)return;
                this.bailItem = {
                    id:row.id,
                    billId:row.billId,
                    remark:row.remark,
                    bail:row.bail,
                    returnBail:row.returnBail,
                    returnedBail:row.returnedBail,
                    incomeBail:row.incomeBail,
                    mark:row.mark
                };
                this.bailInfoDialog = true;
            },
            /**保证金列表-保存编辑信息**/
            saveBailInfo(){
                let self = this;
                this.bailItem.returnBail = this.returnBail;
                resource.bailUpdate(this.bailItem,function(result){
                    if(result.code==200){
                        self.$message({
                            message: result.msg,
                            type: 'success'
                        });
                        self.showDetail(null,null,self.bailItem.billId);
                        self.bailInfoDialog = false;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            /**保证金列表-确认处理**/
            confirmHandle(index, row){
                if(row.returnBail != 0 || row.state != 0)return;
                let self = this;
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
                            self.showDetail(null,null,self.detail.baseInfo.id);
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

<style scoped>
    .search .input{
        width: 180px;
        margin-right: 30px;
    }
    .cell{
        padding: 2px 0 2px 10px;
    }
    .row{
        width: 80%;
    }
    .container{
        height: 300px;
    }
    .w180{
        width: 180px;
    }
    .m-left44{
        margin-left: 44px;
    }
</style>
