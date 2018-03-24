<template>
    <!--<div>装修管理</div>-->
    <div>
        <div class="topaction">
            <Row>
                <Col :span="1" style="text-align:right; line-height:32px; font-size:14px;">游戏</Col>
                <Col :span="3">
                    <Select style="width:80%; margin-left:10px;" value="all" @on-change="screen">
                        <Option value="all">全部</Option>
                        <Option value="tablet">牌匾</Option>
                        <Option value="background">背景</Option>
                    </Select>
                </Col>
                <Col :span="2">
                    <Button type="primary" long @click="addPlan">添加方案</Button>
                </Col>
            </Row>
        </div>
        <div class="content" style="margin-top:15px;">
            <Table :columns="columns" :data="dataList"></Table>
        </div>
    </div>
</template>

<script>
    import { getDecorationsList, errorHandle, getImgFromOSS, removeDecorationByURL } from '../service';
    import _ from 'lodash';
    export default {
        name: 'index',
        data () {
            return {
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        width: 180,
                        render: (h, params) => {
                            return h('span', params.index + 1);
                        }
                    },
                    {
                        title: '图片',
                        key: 'image',
                        width: 280,
                        render: (h, params) => {
                            return h('img', {
                                domProps: {
                                    src: getImgFromOSS(params.row.url)
                                },
                                style: {
                                    width: '100%',
                                    margin: '10px'
                                }
                            });
                        }
                    },
                    {
                        title: '图片类型',
                        key: 'type',
                        width: 100,
                        render: (h, params) => {
                            let type = params.row.type === 'tablet' ? '牌匾' : '背景';
                            return h('span', type);
                        }
                    },
                    {
                        title: '操作',
                        key: 'actions',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: async () => {
                                            try {
                                                let p = {
                                                    delTablet: '',
                                                    delBackground: ''
                                                }
                                                params.row.type === 'tablet' ? p['delTablet'] = params.row.url : p['delBackground'] = params.row.url;
                                                let {status} = await removeDecorationByURL(p);
                                                if (status.code !== 0) {
                                                    throw(new Error(status.message));
                                                }
                                                this.$Message.success('删除成功');
                                                this.getDecorations();
                                            } catch(e) {
                                                errorHandle(e, this);
                                            }
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                dataList: [],
                alldataList: [],
                count: 0
            };
        },
        methods: {
            addPlan () {
                this.$router.push('/add-plan');
            },
            async getDecorations () {
                try {
                    let {status, data} = await getDecorationsList(this.page)
                    if (status.code !== 0) {
                        throw (new Error(status.message));
                    }
                    this.dataList = data;
                    this.alldataList = data;
                    this.count = data.count;
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            screen (value) {
                if (value === 'all') {
                    return this.dataList = this.alldataList;
                }
                this.dataList = _.filter(this.alldataList, function(o) {return o.type === value})
            }
        },
        created () {
            this.getDecorations();
        }
    };
</script>

<style scoped>

</style>