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
                <el-select v-model="searchInfo.organization" class="frame" size="small" placeholder="全部">
                    <el-option
                        v-for="item in organizationList"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"
                    ></el-option>
                </el-select>
                <span class="search-label">还款时间</span>
                <el-date-picker
                    class="frame"
                    v-model="searchInfo.repaymentDateBegin"
                    type="date"
                    size="small"
                    placeholder="开始时间">
                </el-date-picker>
                <span>-</span>
                <el-date-picker
                    class="frame"
                    v-model="searchInfo.repaymentDateEnd"
                    type="date"
                    size="small"
                    placeholder="结束时间">
                </el-date-picker>
                <div class="m-top10">
                    <span class="search-label m-left0">姓名</span>
                    <el-input class="input" v-model="searchInfo.customerName" size="small" placeholder="姓名"></el-input>
                    <span class="search-label m-left0">状态</span>
                    <el-select v-model="searchInfo.organization" class="frame" clearable size="small" placeholder="全部">
                        <el-option
                            v-for="item in statusList"
                            :key="item.code"
                            :label="item.value"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <el-button size="small" class="search-btn" type="primary" icon="el-icon-search" @click="triggerSearch">搜索</el-button>
                </div>
            </div>
        </div>

        <el-table :data="tableData" border max-height="450" :cell-style="{padding:'3px 0'}" @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column label="序号" width="50" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="remark" width="280" label="借款摘要"  align="center" ></el-table-column>
            <el-table-column prop="returnDate" width="100"  label="应还日期"  align="center" ></el-table-column>
            <el-table-column prop="returnPrincipal" label="应还本金"  align="center" ></el-table-column>
            <el-table-column prop="returnInterest" label="应还利息"  align="center" ></el-table-column>
            <el-table-column prop="otherCharge" label="其它费用"  align="center" ></el-table-column>
            <el-table-column prop="" label="合计"  align="center" ></el-table-column>
            <el-table-column prop="mark" width="200" label="备注"  align="center" ></el-table-column>
            <el-table-column prop="state" label="状态"  align="center" ></el-table-column>
            <el-table-column prop="confirmRepayDate" label="确认时间" width="100" align="center" ></el-table-column>
            <el-table-column  label="操作" width="120" align="center" fixed="right">
                <template scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="confirmRepayment(scope.$index, scope.row)">确认还款</el-button>
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

        <el-dialog title="还款信息" :visible.sync="editItemDialog" center>
            <el-form :model="editItem" :rules="rules" ref="editItem" :label-position="'right'" label-width="150px" inline-message>

                <el-form-item size="small" label="应还日期" prop="name" >
                    <el-input v-model="editItem.returnDate" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="应还本金"  prop="phone" >
                    <el-input v-model="editItem.returnPrincipal" class="row" disabled></el-input>
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
                    pageNo:0,
                    count:10,
                    organization:'',
                    repaymentDateBegin:'',
                    repaymentDateEnd:''
                },
                tableData:[],
                multipleSelection:[],
                editItem:{},
                rules:{},
                statusList:[
                    {
                        code:1,
                        value:'未还款'
                    },{
                        code:2,
                        value:'已还款'
                    }
                ],
                organizationList:[],
                editItemDialog:false
            }
        },
        created(){
            this.search();
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
            search(){
                let self = this;
                resource.repaymentList(this.searchInfo,function(result){
                    if(result.code==200){
                        self.tableData = result.data.list;
                        self.total_count = result.data.total_count;
                    }else{
                        self.$message.error(result.msg);
                    }
                });
            },
            handleEdit(index, row){
                this.tmpRow = row;
                this.editItem = {
                    id:row.id,
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
            confirmRepayment(index,row){
                var self = this;
                this.$confirm('是否确认还款?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.$message({
                        message: '还款成功',
                        type: 'success'
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
