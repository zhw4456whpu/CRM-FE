<template>
    <div class="summery-statics" style="background:#fff; padding:20px;">
        <h2>统计概况</h2>
        <Row class="chage-button">
            <Col span="1"><Button type="primary">今日</Button></Col>
            <Col span="1"><Button type="ghost">昨日</Button></Col>
            <Col span="1"><Button type="ghost">近7天</Button></Col>
            <Col span="2"><Button type="ghost">近三十天</Button></Col>
        </Row>   
        <Row>
            <Col span="12"  class="statist-show" style="margin-right:4%;">
                <Row  class="head-title">访问统计</Row>
                <Row>
                    <Col span="8" class="zone">
                        <b>访客数</b>
                        <p>{{visitorsNum}}</p>
                    </Col>  
                    <Col span="8" class="zone">
                        <b>浏览量</b>
                        <p>{{browseNum}}</p>
                    </Col>
                    <Col span="8" class="zone">
                        <b>访问次数</b>
                        <p>{{requestNum}}</p>
                    </Col>  
                </Row>
            </Col>
            <Col span="11" class="statist-show">
                <Row  class="head-title">对话统计</Row>
                <Row>
                    <Col span="12" class="zone">
                        <b>总对话数</b>
                        <p>{{dialogNum}}</p>
                    </Col>  
                    <Col span="12" class="zone">
                        <b>有效对话数</b>
                        <p>{{effectiveNum}}</p>
                    </Col> 
                </Row>                          
            </Col>
        </Row> 
        <Row class="statist-show">
            <Row  class="head-title">排队统计</Row>
            <Col span="5" class="zone">
                <b>排队数</b>
                <p>{{lineNum}}</p>
            </Col>
            <Col span="5" class="zone">
                <b>放弃排队数</b>
                <p>{{giveupNum}}</p>
            </Col>
            <Col span="5" class="zone">
                <b>平均放弃排队时长</b>
                <p>{{AverageTime}}</p>
            </Col>
            <Col span="4" class="zone">
                <b>平均排队时长</b>
                <p>{{classifyTime}}</p>
            </Col>
            <Col span="4" class="zone">
                <b>最长排队时长</b>
                <p>{{longestTime}}</p>
            </Col>                                         
        </Row>
        <div class="bottom-linemap">
            <Dropdown class="drop" @on-click="changeMenu">
                <a href="javascript:void(0)" name="pre"  v-html='this.MenuText' >
                </a>
                <Icon type="arrow-down-b"></Icon>                
                <DropdownMenu slot="list">
                    <DropdownItem name="pre">访问统计</DropdownItem>
                    <DropdownItem name="degree">对话统计</DropdownItem>
                    <DropdownItem name="circulate">排队统计</DropdownItem>
                </DropdownMenu>
            </Dropdown>        
            <!-- <div id="myChart" :style="{width: 'calc(100% - 5px )', height: '300px'}" ></div>  -->
            <div id="dialogue" :style="{width: 'calc(100% - 5px )', height: '320px'}"></div> 
        </div>
        <Row :style="{marginTop:'20px'}">
            <Col span="12">
                <div  id="barChart" :style="{width:'720px',height:'300px'}">

                </div>
            </Col>
            <Col span="12">
                <div  id="barCharttwo" :style="{width:'720px',height:'300px'}">

                </div>            
            </Col>            
        </Row>
    </div>
</template>
<script>
export default{
    name: 'SummeryStatics',
    data(){
        return {
            visitorsNum: 562,
            browseNum: 123,
            requestNum: 556,
            dialogNum: 0,
            effectiveNum: 0,
            lineNum:200,
            giveupNum:323,
            AverageTime:243,
            classifyTime:123,
            longestTime:22,
            //seen:false,
            //drop默认文本
            MenuText:'访问统计'
        }

    },
    mounted(){
        // this.drawLine();
        this.drawLineGraph();
        this.barLine();
        this.barLinetwo();
    },
    methods:{
        changeMenu(name){
            if(name=='pre'){
               this.MenuText = '访问统计'
            //根据需要可做些展示隐藏操作
            }else if (name == 'degree') {
                this.MenuText = '对话统计'
            }else {
                this.MenuText = '排队统计'
            }
        },
        drawLineGraph(){
                // 基于准备好的dom，初始化echarts实例
                let dialogue = this.$echarts.init(document.getElementById('dialogue'))
                // 绘制图表
                dialogue.setOption({
                    //title: { text: '访问数分布' },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['访问数','浏览数','访问次数']
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        //show: false,
                        axisTick:{
                            show: false,
                        },
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: {
                        type: 'value',
                        //show: false
                    },
                    series: [
                        {
                            name:'访问数',
                            type: "line",//折线图
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210],                           
                            itemStyle: {
                                normal: {
                                color: "#13C27C",//折线点的颜色
                                lineStyle: {
                                color: "#13C27C"//折线的颜色
                                    }
                                }
                            }
                        },
                        {
                            name:'浏览数',
                            type: "line",//折线图
                            stack: '总量',
                            data:[220, 182, 191, 234, 290, 330, 310],                       
                            itemStyle: {
                                normal: {
                                color: "#feae67",//折线点的颜色
                                lineStyle: {
                                color: "#feae67"//折线的颜色
                                    }
                                }
                            }
                        },  
                        {
                            name:'访问次数',
                            type: "line",//折线图
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410],                 
                            itemStyle: {
                                normal: {
                                color: "#2099e0",//折线点的颜色
                                lineStyle: {
                                color: "#2099e0"//折线的颜色
                                    }
                                }
                            }
                        },                                               
                    ]
                });
            }, 
        barLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('barChart'))
                // 绘制图表
                myChart.setOption({
                    title: { text: '首次响应时长' },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['访问数','浏览数','访问次数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                             data : ['11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth : 20,//柱图宽度
                            data:[10, 52, 200, 334, 390, 330, 220],                       
                            itemStyle: {
                                normal: {
                                color: "#13C27C",//折线点的颜色
                                lineStyle: {
                                color: "#13C27C"//折线的颜色
                                    }
                                }
                            }
                        }
                    ]
                });
            }, 
        barLinetwo(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('barCharttwo'))
                // 绘制图表
                myChart.setOption({
                    title: { text: '对话平均响应时长' },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['访问数','浏览数','访问次数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '20',
                            data:[10, 52, 200, 334, 390, 330, 220],                       
                            itemStyle: {
                                normal: {
                                color: "#13C27C",//折线点的颜色
                                lineStyle: {
                                color: "#13C27C"//折线的颜色
                                    }
                                }
                            }
                        }
                    ]
                });
            },                                     
    },
}
</script>
<style lang="less" scoped>
.summery-statics{
    .visitors,.dialog,.queue{
        height: 64px;
    }
    .chage-button{
        margin-top:14px;
    }
    .statist-show{
        border:1px solid #e2e2e2;
        margin-top:30px;
        height: 100px;
        .head-title{
            font-size: 15px;
            font-weight: bold;
            line-height: 30px;
            margin-left:15px;
        }
        .zone{
            border-right:1px solid #eee;
            text-align: center;
            font-size: 13px;
            line-height: 30px;
            p{
                font-weight: bold;
            }
        }
    }
    .bottom-linemap{
        position: relative;
        }
    .drop{
        font-size: 15px;
        position: absolute;  
        z-index: 999; 
        top:15px;
        left: 20px;    
        a{
        color:#333;
        font-weight: bold;
        }
    }
    .ivu-dropdown-rel{
        z-index: 9999;
    }
    #myChart,#dialogue{
        margin-top:30px;
    }
    #myChart,#dialogue,#barChart,#barCharttwo{
        border:1px solid #eee;
        padding:10px;
    }
}
</style>