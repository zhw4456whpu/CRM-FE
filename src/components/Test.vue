<template>
    <section>
        <Row>
            <Col span="6">
                <Input type="text" v-model="input" @on-change="change" width="200"/>
            </Col>
            
        </Row>
        <Row>
            <Col span="6">
                <Input type="text" name="output" v-model="output" width="200"/>
            </Col>
        </Row>
        <Row type="flex" justify="space-around" align="middle" class="code-row-bg">
            <Col span="4"><p style="height: 80px;line-height: 80px;">col-4</p></Col>
            <Col span="4"><p style="height: 30px;line-height: 30px;">col-4</p></Col>
            <Col span="4"><p style="height: 100px;line-height: 100px;">col-4</p></Col>
            <Col span="4"><p style="height: 60px;line-height: 60px;">col-4</p></Col>
        </Row>
        <Row type="flex" justify="space-around" align="middle" class="code-row-ec">
            <Col id="echarts"></Col>
        </Row>
    </section>
</template>
<script>
var data1 = [], data2 = [];
var now = +new Date(1997, 9, 3);
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;
import echarts from 'echarts' 
    export default {
        name:'test',
        data(){
            return {
                input:'',
                output:'',
            }
        },
        methods:{
            sort(str){
                if(str == '') return;
                let a = new Array();
                for(let i=0;i<str.length;i++){
                    a.push(str[i]);
                }
                return a.sort().join('');
            },
            change(){
                this.output = this.sort(this.input);
            },
            randomData(k) {
                now = new Date(+now + oneDay);
                value = value + Math.random() * k - 10;
                return {
                    name: now.toString(),
                    value: [
                        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                        Math.round(value)/1000
                    ]
                }
            },
            initEChart(){
                var myChart = echarts.init(document.getElementById("echarts"));
                
                for (var i = 0; i < 500; i++) {
                    var k1 = Math.random();
                    data1.push(this.randomData(k1+20));
                    var k2 = Math.random();
                    data2.push(this.randomData(k2+21));
                }
                var title = '大坝压力计E2-11、E2-12过程线图';
                var option = {
                    title: {
                        text: title
                    },
                    legend: {
                        data: [
                            {
                                name:'E2-11应力',
                                icon : 'roundRect'
                            }, 
                            {
                                name:'E2-12应力',
                                icon : 'roundRect'
                            }
                        ]
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            params = params[0];
                            var date = new Date(params.name);
                            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: true
                        }
                    },
                    yAxis: {
                        name : '应力(MPa)',
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: 'E2-11应力',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: data1
                    },{
                        name: 'E2-12应力',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: data2
                    }]
                };
                myChart.setOption(option);
            }
        },
        mounted(){
            this.initEChart();
        }
    }
</script>
<style lang="less" scoped>
.code-row-bg{
    width:100%;
    height:200px;
    background : gray;
    >div{
        background : rgba(0,153,229,.7);
    }
}
.code-row-ec{
    width:800px;
    height:500px;
    #echarts{
        width: 700px;
        height: 460px;
    }
}
</style>