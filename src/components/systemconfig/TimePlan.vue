<template>
    <div class="time-plan">
        <Row class="form-title">时间计划设置</Row>
        <Row class="right-table">
            <Row class="right-layout">
                <Tabs :value="curTab" @on-change="changeTab">
                    <TabPane label="工作日" name="workdays">
                        <workdays></workdays>
                    </TabPane>
                    <TabPane label="节假日" name="holidays">
                        <holidays></holidays>
                    </TabPane>
                </Tabs>
            </Row>
        </Row>
    </div>
</template>
<script>
import Workdays from './Workdays'
import holidays from './holidays'
import systemconfig from '../../service/systemconfigApi'
import { formatDate as formatLocalDate } from '../../utils'
export default {
    name: 'TimePlan',
    components: {
        Workdays,
        holidays
    },
    data(){
        return {
            curTab: 'workdays',
        }
    },
    methods:{
        changeTab(val){
            if(val == 'workdays'){
                
            }
        }
    }
}
</script>
<style lang="less" scoped>
.time-plan{
    background: white;
    .form-title{
        font-size: 18px;
        text-align: left;
        padding-left: 40px;
        height: 107px;
        line-height: 107px;
    }
    .left-bar{
        
        border-radius: 5px;
        padding: 6px;

        .self-plan{
            background-color: #3fa9ee;
            font-size: 12px;
            color: white;
        }
    }

    .right-table{
        padding-bottom:20px;
        .right-layout{
            background: white;
            border-radius: 5px;
            padding:0px 40px;
        }
    }
}   
</style>
<style lang="less">
.right-layout{
    .ivu-tabs-bar{
        background-color: #F7F9FC;
        .ivu-tabs-nav{
            height: 60px;
            line-height: 60px;
            width: 100%;
            
        }
    }
}
</style>