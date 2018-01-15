<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="info-block bg1">
                    <i class="icon-inbox info-block-ico"></i>
                    <p class="p1">23,780,000</p>
                    <p class="p2">贷款总额</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="info-block bg2">
                    <i class="icon-money info-block-ico"></i>
                    <p class="p1">8,740,000</p>
                    <p class="p2">收回本金</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="info-block bg3">
                    <i class="icon-bar-chart info-block-ico"></i>
                    <p class="p1">12,550,000</p>
                    <p class="p2">营业收入</p>
                </div>
            </el-col>
        </el-row>
        <h3 class="m-top50">近年营业总额(万元)</h3>
        <img class="m-top20" src="/static/img/201801152207581.png" alt="">
    </div>
</template>

<script>
    export default {
        data: function(){
            return {}
        }
    }
</script>

<style scoped>
    .info-block{
        position: relative;
        height: 100px;
        font-size: 30px;
        color: #fff;
    }
    .info-block .info-block-ico{
        position: absolute;
        top: 23px;
        left: 20px;
        font-size: 50px;
    }
    .info-block p{
        position: absolute;
        right: 20px;
        text-align: right;
        z-index: 1;
    }
    .info-block .p1{
        top: 33px;
    }
    .info-block .p2{
        bottom: 18px;
        font-size: 14px;
    }
    .info-block:hover:before{
        position: absolute;
        top: 0;
        left: 0;
        content: '';
        width: 100%;
        height: 100%;
        background-color:  rgba(0,0,0,0.5);
    }
    .bg1{
        background-color: #FA2A00;
    }
    .bg2{
        background-color: #ffb400;
    }
    .bg3{
        background-color: #1ABC9C;
    }
    .m-top20{
        margin-top: 20px;
    }
    .m-top50{
        margin-top: 50px;
    }
</style>
