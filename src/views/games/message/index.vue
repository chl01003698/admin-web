<template>
    <div>
        <Row :gutter="16">
            <Col span="4">
                <Input v-model="email" type="text" value="">
                    <span slot="prepend">邮件标题</span>
                </Input>
            </Col>
            <Col span="4">
                <Input v-model="target" type="text" value="">
                    <span slot="prepend">目标</span>
                </Input>
            </Col>
            <Col span="6" :style="{textAlign:'left'}">
                <Button type="primary" @click="search">搜索</Button>
                <Button type="warning" @click="reset">重置</Button>
            </Col>
            <Col span="2" :push="8" :style="{textAlign:'center'}">
                <Button type="primary" @click="addMessage">添加消息</Button>
            </Col>
        </Row>
        <div class="table-content">
            <Table :columns="columns" :data="dataList" border></Table>
        </div>
        <div class="page" style="text-align:center; margin-top:15px;">
            <Page :total="count" :current="page" @on-change="filp"></Page>
        </div>
    </div>
</template>

<script>
    import { getMessageList, errorHandle } from '../service';
    import dateformat from 'dateformat';
    export default {
        name: 'index',
        data () {
            return {
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 70,
                        render: (h, params) => {
                            return h('span', params.index + 1);
                        }
                    },
                    {
                        title: '发送目标',
                        key: 'to',
                        width: 90
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '副标题',
                        key: 'subtitle'
                    },
                    {
                        title: '邮件内容',
                        key: 'content'
                    },
                    {
                        title: '按钮类型',
                        key: 'btnTitle',
                        width: 90
                    },
                    // {
                    //     title: '跳转目标',
                    //     key: 'jumpTarget'
                    // },
                    {
                        title: '附件物品',
                        key: 'items',
                        width: 200,
                        render: (h, params) => {
                            let items = params.row.items;
                            let arr = [];
                            let arrType = {
                                Card: '桌卡',
                                Match: '赛卡'
                            };
                            if (items && items instanceof Array) {
                                items.forEach(content => {
                                    let item = h('p', `类型：${arrType[content.itemId]} | 数量：${content.count}`);
                                    arr.push(item);
                                });
                                if (arr.length) {
                                    return h('div', arr);
                                }
                            }
                            return h('span', {style: {color: '#999'}}, '没有附加商品');
                        }
                    },
                    // {
                    //     title: '附加文字',
                    //     key: 'fujiawenzi'
                    // },
                    {
                        title: '定时发送时间',
                        key: 'timing',
                        width: 150,
                        render: (h, params) => {
                            if (params.row.timing) {
                                console.log(params.row.date)
                                return h('span', dateformat(params.row.date, 'yyyy-mm-dd HH:MM'));
                            }
                            return h('span', '立即发送');
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 70,
                        render: (h, params) => {
                            let status = null;
                            console.log(params)
                            if (params.row.status === 1) {
                                status = h('span', {style: {color: 'green'}}, '成功');
                            } else if (params.row.status === 2) {
                                status = h('span', {style: {color: 'red'}}, '失败');
                            } else {
                                status = h('span', '未知');
                            }
                            return status;
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 130,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push('/editMessage/' + params.row._id);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let id = params.row._id;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                dataList: [],
                page: 1,
                count: 0,
                email: '',
                target: ''
            };
        },
        methods: {
            addMessage () {
                this.$router.push('/addMessage');
            },
            fetchList () {
                getMessageList(this.page, this.email, this.target).then(data => {
                    if (data.status.code === 0) {
                        this.dataList = data.data.docs;
                        this.count = data.data.count;
                        this.dataList.forEach(content => {
                            if (content.type === 0) {
                                content.to = '全服';
                            }
                        });
                    }
                }).catch(error => {
                    errorHandle(error, this);
                });
            },
            search () {
                this.page = 1;
                this.fetchList();
            },
            filp (val) {
                this.page = val;
                this.fetchList();
            },
            reset () {
                this.page = 1;
                this.email = '';
                this.target = '';
                this.fetchList();
            }
        },
        created () {
            this.fetchList();
        }
    };
</script>

<style scoped lang="less">
    .table-content {
        margin-top:15px;
    }
</style>
