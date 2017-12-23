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
            <span class="search-label">贷款时间</span>
            <el-date-picker
                class="frame"
                v-model="searchInfo.borrowDateBegin"
                type="date"
                size="small"
                placeholder="开始时间">
            </el-date-picker>
            <span>-</span>
            <el-date-picker
                class="frame"
                v-model="searchInfo.borrowDateEnd"
                type="date"
                size="small"
                placeholder="结束时间">
            </el-date-picker>
            <span class="search-label">公司</span>
            <el-select v-model="searchInfo.organization" class="frame" size="small" placeholder="全部">
                <el-option
                    v-for="item in organizationList"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code"
                ></el-option>
            </el-select>
            <span class="search-label">姓名</span>
            <el-input class="input frame" v-model="searchInfo.customerName" size="small" placeholder="姓名"></el-input>
            <el-button class="m-left20" size="small" type="primary" icon="el-icon-search" @click="triggerSearch">搜索</el-button>
        </div>

        <el-table :data="tableData" border max-height="500" :cell-style="{padding:'3px 0'}">
            <el-table-column label="序号" width="70" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="name" label="公司" width="150"  align="center" ></el-table-column>
            <el-table-column prop="name" label="姓名"  align="center" ></el-table-column>
            <el-table-column prop="phone" label="手机"  width="150" align="center" ></el-table-column>
            <el-table-column prop="name" label="贷款金额"  align="center" ></el-table-column>
            <el-table-column prop="name" label="每期应还本金" width="150" align="center" ></el-table-column>
            <el-table-column prop="name" label="每期应还利息" width="150"  align="center" ></el-table-column>
            <el-table-column prop="name" label="贷款时间"  align="center" ></el-table-column>
            <el-table-column prop="name" label="期数"  align="center" ></el-table-column>
            <el-table-column prop="name" label="保证金"  align="center" ></el-table-column>
            <el-table-column prop="name" label="服务费"  align="center" ></el-table-column>
            <el-table-column prop="name" label="家访费"  align="center" ></el-table-column>
            <el-table-column prop="name" label="其它费用"  align="center" ></el-table-column>
            <el-table-column prop="name" label="已还本金"  align="center" ></el-table-column>
            <el-table-column prop="name" label="已还利息"  align="center" ></el-table-column>
            <el-table-column  label="操作"  align="center" width="150" fixed="right">
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
                       :page-sizes="[10, 20, 50]"
                       :page-size="searchInfo.count"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total_count">
        </el-pagination>

        <el-dialog width="60%" :visible.sync="detailDialog" center>
            <el-tabs type="border-card">
                <el-tab-pane label="贷款单信息">
                    <el-row class="border-top-left">
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>公司:</span>
                            <span>地狱边境</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>姓名:</span>
                            <span>AlexMason</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>手机:</span>
                            <span>18621576212</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>贷款金额:</span>
                            <span>20000.00</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>期数:</span>
                            <span>10</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>每期应还本金:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>每期应还利息:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>保证金:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>服务费:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>家访费:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>诉讼费:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>其它费用:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>已还本金:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>已还利息:</span>
                            <span>2000</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>&nbsp;</span>
                        </el-col>
                        <el-col :span="6" class="border-bottom-right cell">
                            <span>&nbsp;</span>
                        </el-col>
                        <el-col :span="24" class="border-bottom-right cell">
                            <span>备注:</span>
                            <span>太阳出来咿呦喂,天地宽来么咿呦喂,青山脚下水弯弯来,曲折折来十八弯,荆江水呀么鱼摆摆,肥冬冬呀么咿呦喂,没得海椒麻辣辣,不得吃唉呀咿呦</span>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="还款单信息">
                    <el-table :data="detail.repaymentInfo" border max-height="300" :cell-style="{padding:'3px 0'}">
                        <el-table-column label="序号" width="70" scope="scope" align="center" fixed>
                            <template scope="scope">
                                <span v-text="scope.$index+1"></span>
                            </template>
                        </el-table-column >
                        <el-table-column prop="name" label="借款摘要"  align="center" ></el-table-column>
                        <el-table-column prop="phone" label="应还日期"  align="center" ></el-table-column>
                        <el-table-column prop="address" label="应还本金"  align="center" ></el-table-column>
                        <el-table-column prop="iDCardNo" label="应还利息"  align="center" ></el-table-column>
                        <el-table-column prop="createTime" label="其它费用"  align="center" ></el-table-column>
                        <el-table-column prop="createTime" label="合计"  align="center" ></el-table-column>
                        <el-table-column prop="createTime" label="备注"  align="center" ></el-table-column>
                        <el-table-column prop="createTime" label="状态"  align="center" ></el-table-column>
                        <el-table-column  label="操作" align="center">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="保证金信息">
                    <el-table :data="detail.depositInfo" border max-height="300" :cell-style="{padding:'3px 0'}">
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
                </el-tab-pane>
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
                    pageNo:0,
                    count:10,
                    borrowDateBegin:'',
                    borrowDateEnd:'',
                    organization:'',
                    customerName:''
                },
                tableData:[],
                detail:{
                    baseInfo:{},
                    repaymentInfo:[],
                    depositInfo:[]
                },
                detailDialog:false,
                organizationList:[
                    {
                        code:1,
                        value:'冰帝'
                    },{
                        code:2,
                        value:'诸神'
                    },{
                        code:3,
                        value:'秩序'
                    },{
                        code:4,
                        value:'地狱边境'
                    }
                ]
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
            showDetail(index,row){
                this.detailDialog = true;

            },
            deleteItem(index, row){
                let self = this;
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
        }
    }
</script>

<style scoped>
    .search .input{
        width: 180px;
        margin-right: 30px;
    }
    .search .frame{
        width: 150px;
    }
    .cell{
        padding: 2px 0 2px 10px;
    }
</style>
