<template>
    <Collapse accordion value="1">
        <Panel name="1">
            <div slot="content">
                <template v-for="(item,index) in props.adminConfig">
                    <Checkbox
                    :indeterminate="props.indeterminate[index]"
                    :value="props.checkAll[index]"
                    @click.prevent.native="handleCheckAll(index)">{{item.menuName}}</Checkbox>
                    <CheckboxGroup v-model="props.checkAllGroup[index]" @on-change="(e)=>{checkAllGroupChange(e,index)}">
                        <Checkbox :label="sitem.menuName" v-for="(sitem,sindex) in item.children" :key="sindex">
                            <span>{{sitem.menuName}}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </template>
            </div>
        </Panel>
    </Collapse>
</template>
<script>
export default {
    name: 'AuthorityConfig',
    props: ['props'],
    data(){
        return {
            cbData:{
                indeterminate: [],
                checkAll: [],
                adminConfig :[],
                checkAllGroup:[]
            }
        }
    },
    methods: {
        filterData(){
            this.cbData.adminConfig.map(p=>{
                p.isChecked = false;
                p.children.map(c=>{
                    c.isChecked = false;
                    this.cbData.checkAllGroup.map(cb=>{
                        if(cb.indexOf(c.menuName) > -1){
                            p.isChecked = c.isChecked = true;
                        }
                    })
                })
            });
        },
        checkAllGroupChange(data,index){
            let len = this.cbData.adminConfig[index].children.length;
            this.cbData.adminConfig[index].children.map(item=>{
                if (data.length === len) {
                    this.cbData.indeterminate[index] = false;
                    this.cbData.checkAll[index] = true;
                } else if (data.length > 0) {
                    this.cbData.indeterminate[index] = true;
                    this.cbData.checkAll[index] = false;
                    
                } else {
                    this.cbData.indeterminate[index] = false;
                    this.cbData.checkAll[index] = false;
                }
            });
            
            this.filterData();
            this.$emit('checkAllGroupChange',{...this.cbData});
        },
        handleCheckAll(index){
            if (this.cbData.indeterminate[index]) {
                this.cbData.checkAll[index] = false;
            } else {
                this.cbData.checkAll[index] = !this.cbData.checkAll[index];
            }
            this.cbData.indeterminate[index] = false;

            if (this.cbData.checkAll[index]) {
                this.cbData.checkAllGroup[index] = this.props.adminConfig[index].children.map(item=>{
                    return item.menuName;
                });
                this.cbData.checkAllGroup[index].map(item=>{
                    this.props.adminConfig[index].children.map(aitem=>{
                        if(item = aitem.menuName){
                            this.cbData.adminConfig[index].isChecked = true;
                            this.cbData.adminConfig[index].children.map(i=>{
                                i.isChecked = true;
                            })
                        }
                    });
                })
                
            } else {
                this.cbData.checkAllGroup[index] = [];
            }
            this.filterData();
            this.$emit('handleCheckAll',{...this.cbData});
        },
    },
    beforeCreate(){
    },
    created(){
        
    },
    mounted(){
        this.cbData = this.props;
    }
}
</script>