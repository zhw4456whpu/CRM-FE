<template>
    <div class="orderstatics" style="background:#fff; padding:20px;">  
        <Row class="chage-button">
            <h2>营销数据</h2>
            <Col span="10" style="margin-top:10px;">
            <Dropdown style="margin-left: 20px">
                <Button type="primary">
                    选择筛选器
                    <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem>111</DropdownItem>
                    <DropdownItem>222</DropdownItem>
                    <DropdownItem>333</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown trigger="custom" :visible="visible" style="margin-left: 20px">
                 <Button type="ghost"  @click="handleOpen">
                    设置显示列
                    <Icon type="arrow-down-b"></Icon>
                </Button>               
                <DropdownMenu slot="list">
                    <div>
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;top:30px;left:400px;">
                            <Checkbox
                                :indeterminate="indeterminate"
                                :value="checkAll"
                                @click.prevent.native="handleCheckAll">全选</Checkbox>
                        </div>
                        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                            <Checkbox label="搜索词"></Checkbox>
                            <Checkbox label="接待客服"></Checkbox>
                            <Checkbox label="本次访问时间"></Checkbox>
                            <Checkbox label="对话时长"></Checkbox>
                            <Checkbox label="响应时间"></Checkbox>
                            <Checkbox label="消息数"></Checkbox>  
                            <Checkbox label="访问"></Checkbox>
                            <Checkbox label="对话方式"></Checkbox>
                            <Checkbox label="对话结果"></Checkbox>  
                            <Checkbox label="访问页面"></Checkbox>
                            <Checkbox label="浏览器标签"></Checkbox>                                                                                      
                        </CheckboxGroup>
                    </div>
                    <div style="text-align: right;margin:10px;">
                        <Button type="primary" @click="handleClose">关闭</Button>
                    </div>
                </DropdownMenu>
            </Dropdown>
                <Button type="ghost">导出数据</Button>    
            </Col>
            <Col span="14" style="text-align:right;"><Button type="primary">筛选</Button></Col>
        </Row>
        <Table :columns="columns1" :data="data1" style="margin-top:30px;"></Table>
    </div>
</template>
<script>
export default {
    name:'orderstatics',
    data(){
        return{
                visible: false,
                //设置显示列选项
                indeterminate: true,
                checkAll: false,
                checkAllGroup: ['搜索词', '接待客服','本次访问时间', '对话时长','响应时间','消息数','访问','对话方式','对话结果','访问页面','浏览器标签'],                
                columns1: [
                    {
                        title: '访客信息',
                        key: 'message'
                    },
                    {
                        title: '对话时间',
                        key: 'time'
                    },
                    {
                        title: '搜索词',
                        key: 'seach'
                    },
                    {
                        title: '本次访问时间',
                        key: 'nowtime'
                    },
                    {
                        title: '接待客服',
                        key: 'customer'
                    },
                    {
                        title: '响应时间',
                        key: 'responsetime'
                    },
                    {
                        title: '消息数',
                        key: 'messagesNum'
                    },
                    {
                        title: '访问',
                        key: 'Visit'
                    },
                    {
                        title: '对话结果',
                        key: 'result'
                    },
                    {
                        title: '访问页数',
                        key: 'pagesNum'
                    }                                                             
                ],
                data1: [
                    {
                        message: '访客信息',
                        time: '对话时间',
                        seach: '21245',
                        nowtime: '2016-10-03',                        
                        customer: '客服001',                        
                        responsetime: '10:02',
                        messagesNum: '22',                        
                        Visit: '访问',
                        result: '对话结果',
                        pagesNum: '2333'
                    },
                    {
                        message: '访客信息',
                        time: '对话时间',
                        seach: '21245',
                        nowtime: '2016-10-03',                        
                        customer: '客服001',                        
                        responsetime: '10:02',
                        messagesNum: '22',                        
                        Visit: '访问',
                        result: '对话结果',
                        pagesNum: '2333'
                    },
                    {
                        message: '访客信息',
                        time: '对话时间',
                        seach: '21245',
                        nowtime: '2016-10-03',                        
                        customer: '客服001',                        
                        responsetime: '10:02',
                        messagesNum: '22',                        
                        Visit: '访问',
                        result: '对话结果',
                        pagesNum: '2333'
                    },
                    {
                        message: '访客信息',
                        time: '对话时间',
                        seach: '21245',
                        nowtime: '2016-10-03',                        
                        customer: '客服001',                        
                        responsetime: '10:02',
                        messagesNum: '22',                        
                        Visit: '访问',
                        result: '对话结果',
                        pagesNum: '2333'
                    },
                    {
                        message: '访客信息',
                        time: '对话时间',
                        seach: '21245',
                        nowtime: '2016-10-03',                        
                        customer: '客服001',                        
                        responsetime: '10:02',
                        messagesNum: '22',                        
                        Visit: '访问',
                        result: '对话结果',
                        pagesNum: '2333'
                    },
                    {
                        message: '访客信息',
                        time: '对话时间',
                        seach: '21245',
                        nowtime: '2016-10-03',                        
                        customer: '客服001',                        
                        responsetime: '10:02',
                        messagesNum: '22',                        
                        Visit: '访问',
                        result: '对话结果',
                        pagesNum: '2333'
                    },                                        
                ]
            }
        },
        methods: {
            handleOpen () {
                this.visible = true;
            },
            handleClose () {
                this.visible = false;
            },
            //设置显示列
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = ['搜索词', '接待客服','本次访问时间', '对话时长','响应时间','消息数','访问','对话方式','对话结果','访问页面','浏览器标签'];
                } else {
                    this.checkAllGroup = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === 11) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            }            
        }     
}
</script>
<style scoped lang="less">
.orderstatics{
    .ivu-select-dropdown{
            // top:35px;
            // left:480px;
       .ivu-dropdown-menu{
             width: 380px;
             margin-left: 15px;
            .ivu-checkbox-group-item{
                margin-bottom: 10px;
            }
       }
    }
}

</style>

