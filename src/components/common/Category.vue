<template>
    <Row class="category">
        <ul class="category-list">
            <li v-for="(item,index) in categoryList" :value="item.value" :key="item.value">
                <Row class="category-info">
                    <h3 class="category-name b-category-name">
                        <i>
                            <img v-lazy="item.typeImg" />
                        </i>
                        <a class="ml-35">{{item.label}}</a>
                        <em>></em>
                    </h3>
                </Row>
                <Row class="menu-item menu-in top">
                    <Row class="area-in">
                        <Row class="area-bg">
                            <Row class="menu-sort">
                                <Row class="sort-side">
                                    <dl class="dl-sort" v-for="sub in item.subCat" :value="sub.value" :key="sub.value">
                                        <dt class="title">{{sub.label}}</dt>
                                        <dd v-for="detail in sub.details" :value="detail.value" :key="detail.value" ><a>{{detail.label}}</a></dd>
                                    </dl>
                                </Row>
                                <Row class="brand-side">
                                    <dl class="dl-sort">
                                        <dt class="title"><span>实力商家</span></dt>
                                        <dd v-for="man in item.businessman" :value="man.value" :key="man.value" ><a>{{man.label}}</a></dd>
                                    </dl>
                                </Row>
                            </Row>
                        </Row>
                    </Row>
                    <b class="arrow"></b>
                </Row>
            </li>
        </ul>
    </Row>
</template>
<script>
export default{
    name:'Category',
    data(){
        return {
            //是否显示商品分类细节
            showDetails:false,
            //商品分类数据
            categoryList:[
                {
                    label:'点心/蛋糕',//分类名称
                    value:'1',//value
                    typeImg:'../../../static/i/home/cake.png',//图片
                    subCat:[//子分类
                        {
                            label:'蛋糕',//子分类名称
                            value:'1',//value
                            details:[
                                {
                                    label:'蒸蛋糕',//子分类下的商品
                                    value:'1'//value
                                },{
                                    label:'蒸蛋糕',
                                    value:'2'
                                },{
                                    label:'蒸蛋糕',
                                    value:'3'
                                },{
                                    label:'蒸蛋糕',
                                    value:'4'
                                },{
                                    label:'蒸蛋糕',
                                    value:'5'
                                },{
                                    label:'蒸蛋糕',
                                    value:'6'
                                },{
                                    label:'蒸蛋糕',
                                    value:'7'
                                },{
                                    label:'蒸蛋糕',
                                    value:'8'
                                },{
                                    label:'蒸蛋糕',
                                    value:'9'
                                }
                            ],
                            
                        },
                        {
                            label:'点心',
                            value:'2',
                            details:[
                                {
                                    label:'点心',
                                    value:'1'
                                },{
                                    label:'点心',
                                    value:'2'
                                },{
                                    label:'点心',
                                    value:'3'
                                },{
                                    label:'点心',
                                    value:'4'
                                },{
                                    label:'点心',
                                    value:'5'
                                },{
                                    label:'点心',
                                    value:'6'
                                },{
                                    label:'点心',
                                    value:'7'
                                },{
                                    label:'点心',
                                    value:'8'
                                },{
                                    label:'点心',
                                    value:'9'
                                }
                            ]
                        },
                        
                    ],
                    businessman:[
                        {
                            label:'aa旗舰店',
                            value:'1'
                        },{
                            label:'aa旗舰店',
                            value:'2'
                        },{
                            label:'aa旗舰店',
                            value:'3'
                        },{
                            label:'aa旗舰店',
                            value:'4'
                        },{
                            label:'aa旗舰店',
                            value:'5'
                        },{
                            label:'aa旗舰店',
                            value:'6'
                        },{
                            label:'aa旗舰店',
                            value:'7'
                        },{
                            label:'aa旗舰店',
                            value:'8'
                        }
                    ]
                },
                {
                    label:'饼干/膨化',
                    value:'2',
                    typeImg:'../../../static/i/home/cookies.png',
                },{
                    label:'熟食/肉类',
                    value:'3',
                    typeImg:'../../../static/i/home/meat.png',
                },
                {
                    label:'素食/卤味',
                    value:'4',
                    typeImg:'../../../static/i/home/bamboo.png',
                },
                {
                    label:'坚果/炒货',
                    value:'5',
                    typeImg:'../../../static/i/home/nut.png',
                },
                {
                    label:'糖果/蜜饯',
                    value:'6',
                    typeImg:'../../../static/i/home/candy.png',
                },
                {
                    label:'巧克力',
                    value:'7',
                    typeImg:'../../../static/i/home/chocolate.png',
                },{
                    label:'海味/河鲜',
                    value:'8',
                    typeImg:'../../../static/i/home/fish.png',
                },{
                    label:'花茶/果茶',
                    value:'9',
                    typeImg:'../../../static/i/home/tea.png',
                },{
                    label:'品牌/礼包',
                    value:'10',
                    typeImg:'../../../static/i/home/package.png',
                }
            ]
        }
    }
}
</script>