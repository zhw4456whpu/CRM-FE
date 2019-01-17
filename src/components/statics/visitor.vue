<template>
    <div class="visitor" style="background:#fff; padding:20px;">
        <h2 >统计概况</h2>
        <Row class="chage-button"  style="margin-top:10px;">
            <Col span="1"><Button type="primary">今日</Button></Col>
            <Col span="1"><Button type="ghost">昨日</Button></Col>
            <Col span="1"><Button type="ghost">近7天</Button></Col>
            <Col span="2"><Button type="ghost">近三十天</Button></Col>
        </Row> 
        <div id="myChart" :style="{width:'calc(100% - 5px )', height: '300px'}" ></div>
        <Table :columns="columns11" :data="data10" border height="500" :style="{marginTop:'20px'}"></Table>         
    </div>
</template>
<script>
export default {
    name:'visitor',
    data(){
        return{
            columns11: [
                {
                    title: '时段',
                    key: 'time',
                    align: 'center',
                    width: 120,
                    fixed: 'left',
                },
                {
                    title: '访问',
                    align: 'center',
                    children: [
                        {
                            title: '访问数',
                            key: 'building',
                            align: 'center',
                            width: 80,
                            // sortable: true
                        },
                        {
                            title: '访问次数',
                            key: 'door',
                            align: 'center',
                            width: 90
                        },
                        {
                            title: '浏览量',
                            key: 'door',
                            align: 'center',
                            width: 80
                        }, 
                        {
                            title: '平均访问数',
                            key: 'door',
                            align: 'center',
                            width: 100
                        },                                                
                    ]
                },
                {
                    title: '排队',
                    align: 'center',
                    children: [
                        {
                            title: '总对话数',
                            key: 'caddress',
                            align: 'center',
                            width: 90
                        },
                        {
                            title: '已接对话数',
                            key: 'cname',
                            align: 'center',
                            width: 100
                        },
                        {
                            title: '对话率',
                            key: 'cname',
                            align: 'center',
                            width: 80
                        }                        
                    ]
                },
                {
                    title: '消息',
                    align: 'center',
                    children: [
                        {
                            title: '客服消息',
                            key: 'caddress',
                            align: 'center',
                            width: 100
                        },
                        {
                            title: '访客消息',
                            key: 'cname',
                            align: 'center',
                            width: 100
                        },
                    ]
                }, 
                {
                    title: '有效对话数',
                    align: 'center',
                    children: [
                        {
                            title: '合计',
                            key: 'caddress',
                            align: 'center',
                            width: 80
                        },
                        {
                            title: '一般对话',
                            key: 'cname',
                            align: 'center',
                            width: 100
                        },
                        {
                            title: '较好对话',
                            key: 'cname',
                            align: 'center',
                            width: 100
                        },
                        {
                            title: '极佳对话',
                            key: 'cname',
                            align: 'center',
                            width: 100
                        }, 
                        {
                            title: '其它',
                            key: 'cname',
                            align: 'center',
                            width: 100
                        },                                                                        
                    ]
                },
                {
                    title: '获取名片数',
                    align: 'center',
                    key:'cards'
                },                                                  
            ],
            data10: []
        }
    },
    mounted(){
        this.drawLine();
        //表格内容
        const data = [];
        for (let i = 0; i < 8; i++) {
            data.push({
                key: i,
                time: '00.00-03.00',
                age: i + 1,
                street: 'Lake Park',
                building: '231',
                door: 2035,
                caddress: '123',
                cname: '241',
                cards: '66',
            });
        }
        this.data10 = data;        
    },
    methods:{
        drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    //title: { text: '访问数分布' },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['总访问数','总消息数','总对话数','总有效对话数']
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
                        data: ['00.00','01.00','02.00','03.00','04.00','05.00','06.00']
                    },
                    yAxis: {
                        type: 'value',
                        //show: false
                    },
                    series: [
                        {
                            name:'总访问数',
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
                            name:'总消息数',
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
                            name:'总对话数',
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
                        {
                            name:'总有效对话数',
                            type: "line",//折线图
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410],                 
                            itemStyle: {
                                normal: {
                                color: "#FF8080",//折线点的颜色
                                lineStyle: {
                                color: "#FF8080"//折线的颜色
                                    }
                                }
                            }
                        },                                                                        
                    ]
                });
            },        
    }
}
</script>
