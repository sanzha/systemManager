<template>
    <div class="wrap">

        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                基础资料
            </el-breadcrumb-item>
            <el-breadcrumb-item>员工管理</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="search">
            <span class="search-label">公司</span>
            <el-select class="frame" v-model="searchInfo.organizationCode" size="small" placeholder="全部">
                <el-option
                    v-for="item in organizationList"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code"
                ></el-option>
            </el-select>
            <span class="search-label">姓名</span>
            <el-input class="input frame" v-model="searchInfo.name" size="small" placeholder="姓名"></el-input>
            <el-button class="m-left20" size="small" type="primary" icon="el-icon-search" @click="triggerSearch">搜索</el-button>
            <el-button class="m-left20" size="small" type="primary" @click="handleAdd">新增</el-button>
        </div>

        <el-table :data="tableData" border max-height="500" :cell-style="{padding:'3px 0'}">
            <el-table-column label="序号" width="50" scope="scope" align="center" fixed>
                <template scope="scope">
                    <span v-text="scope.$index+1"></span>
                </template>
            </el-table-column >
            <el-table-column prop="companyId" label="公司"  align="center" ></el-table-column>
            <el-table-column prop="name" label="姓名"  align="center" ></el-table-column>
            <el-table-column prop="phone" label="手机" width="120" align="center" ></el-table-column>
            <el-table-column prop="bank" label="开户行"  align="center" ></el-table-column>
            <el-table-column prop="bankNo" label="银行账号"  align="center" ></el-table-column>
            <el-table-column prop="isLeave" label="是否离职"  align="center" ></el-table-column>
            <el-table-column prop="openId" label="openId"  align="center" ></el-table-column>
            <el-table-column prop="mark" label="备注"  align="center" ></el-table-column>
            <el-table-column prop="createTime" label="	创建时间"  align="center" ></el-table-column>
            <el-table-column  label="操作"  align="center" width="70" fixed="right">
                <template scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

        <el-dialog title="新增员工" :visible.sync="addItemDialog" center>
            <el-form :model="newItem" :rules="rules" ref="newItem" :label-position="'right'" label-width="150px" inline-message>

                <el-form-item size="small" label="公司" prop="name" >
                    <el-select class="row" v-model="newItem.organizationCode" size="small" placeholder="请选择">
                        <el-option
                            v-for="item in organizationList"
                            :key="item.code"
                            :label="item.value"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item size="small" label="姓名" prop="name" >
                    <el-input v-model="newItem.name" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="手机" prop="name" >
                    <el-input v-model="newItem.phone" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="开户行" prop="name" >
                    <el-input v-model="newItem.bank" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="银行账号" prop="name" >
                    <el-input v-model="newItem.bankNo" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="是否离职" prop="name" >
                    <el-input v-model="newItem.isLeave" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="openId" prop="name" >
                    <el-input v-model="newItem.openId" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="密码" prop="name" >
                    <el-input v-model="newItem.password" type="password" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="备注">
                    <el-input v-model="newItem.mark" class="row" type="textarea"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button size="small" type="primary" @click="saveItem('newItem')">确 定</el-button>
                <el-button size="small" @click="addItemDialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="员工信息" :visible.sync="editItemDialog" center>
            <el-form :model="editItem" :rules="rules" ref="editItem" :label-position="'right'" label-width="150px" inline-message>

                <el-form-item size="small" label="公司" prop="name" >
                    <el-select class="row" v-model="editItem.organizationCode" size="small" placeholder="请选择">
                        <el-option
                            v-for="item in organizationList"
                            :key="item.code"
                            :label="item.value"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item size="small" label="姓名" prop="name" >
                    <el-input v-model="editItem.phone" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="手机" prop="name" >
                    <el-input v-model="editItem.phone" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="开户行" prop="name" >
                    <el-input v-model="editItem.bank" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="银行账号" prop="name" >
                    <el-input v-model="editItem.bankNo" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="是否离职" prop="name" >
                    <el-input v-model="editItem.isLeave" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="openId" prop="name" >
                    <el-input v-model="editItem.openId" class="row"></el-input>
                </el-form-item>

                <el-form-item size="small" label="密码" prop="name" >
                    <el-input v-model="editItem.password" type="password" class="row"></el-input>
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
                    pageNo:0,
                    count:10,
                    name:'',
                    organizationCode:'',
                    DateBegin:'',
                    DateEnd:''
                },
                tableData:[{}],
                newItem:{},
                editItem:{},
                organizationList:[],
                addItemDialog:false,
                editItemDialog:false,
                rules:{}
            }
        },
        created(){
            this.search();
        },
        computed:{
            sequenceNumber(num){
                return num == this.tableData.length ? num : '合计';
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
            search(){
                let self = this;
                resource.userList(this.searchInfo,function(result){
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
                this.newItem = {};
                this.addItemDialog = true;
            },
            saveItem(formName){
                let self = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        resource.Method(self.newItem,function(result){
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
                    id:row.id
                };
                this.resetForm('editItem');
                this.editItemDialog = true;
            },
            updateItem(formName){
                let self = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {

                    } else {

                    }
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
