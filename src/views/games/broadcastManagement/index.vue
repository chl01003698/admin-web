<template>
    <div>
        <div class="topAction">
            <Row :gutter="16">
                <Col :span="2" style="text-align:right; line-height:32px;">
                    生效app
                </Col>
                <Col :span="3">
                    <Select v-model="params.activeGame">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in games" :key="item._id" :value="item._id">{{item.gameName}}</Option>
                    </Select>
                </Col>
                <Col :span="2" style="text-align:right; line-height:32px;">
                    生效模式
                </Col>
                <Col :span="3">
                    <Select v-model="params.activeModel">
                        <Option  :value="0">全部</Option>
                        <Option  :value="1">积分赛</Option>
                        <Option  :value="2">朋友局</Option>
                    </Select>
                </Col>
                <Col :span="2" style="text-align:right; line-height:32px;">
                    状态
                </Col>
                <Col :span="3">
                    <Select v-model="params.status">
                        <Option :value="0">全部</Option>
                        <Option :value="1">等待</Option>
                        <Option :value="2">生效</Option>
                        <Option :value="3">过期</Option>
                        <Option :value="4">失效</Option>
                    </Select>
                </Col>
                <Col :span="2">
                    <Button type="primary" @click="search" long>搜索</Button>
                </Col>
                <Col :span="2">
                <Button type="warning" @click="reset" long>重置</Button>
                </Col>
                <Col :span="2" :push="3">
                    <Button type="primary" long @click="addBroadcast">添加广播</Button>
                </Col>
            </Row>
        </div>
        <div class="content" style="margin-top:15px;">
            <Table :columns="columns" :data="dataList"></Table>
        </div>

        <div class="page" style="margin-top:15px; text-align:center;">
            <Page :total="count" @on-change="filp"></Page>
        </div>

        <Modal
            v-model="showModal"
            title="提示"
            :loading="loading"
            @on-ok="confirmDelete"
        >{{deleteMsg}}</Modal>
    </div>
</template>

<script>
    import { getGamesList, errorHandle, getBroadcastList, deleteBroadcastById, updateBroadcastById } from '../service';
    import moment from 'moment';
    export default {
        name: 'index',
        data () {
            return {
                games: [],
                models: [],
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        render: (h, params) => {
                            return h('span', params.index + 1)
                        }
                    },
                    {
                        title: '描述',
                        key: 'broadcastName'
                    },
                    {
                        title: '内容',
                        key: 'content'
                    },
                    {
                        title: '生效app',
                        key: 'activeGame',
                        render: (h, params) => {
                            return h('span', this.gamesKey[params.row.activeGame])
                        }
                    },
                    {
                        title: '生效模式',
                        key: 'activeModel',
                        render: (h, params) => {
                            return h('span', this.gamesModel[params.row.activeModel])
                        }
                    },
                    {
                        title: '生效时间',
                        key: 'date',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('p', '始：' + moment(params.row.startAt).format('YYYY-MM-DD hh:mm')),
                                h('p', '终：' + moment(params.row.endAt).format('YYYY-MM-DD hh:mm'))
                            ])
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            const colors = ['', '#FFB233', 'green', 'origin', 'red']
                            const status = this.status[params.row.status];
                            const color = colors[params.row.status];
                            return h('span', {style: {color: color}}, status);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width:200,
                        render: (h, params) => {
                            let edit = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push('/edit-broadcast/' + params.row._id);
                                    }
                                }
                            }, '编辑');
                            let del = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.deleteMsg = '确认删除此条广播？';
                                        this.actionType = 'delete';
                                        this.$nextTick(() => {
                                            this.showModal = true;
                                            this.deleteId = params.row._id;
                                        });
                                    }
                                }
                            }, '删除');
                            let exec = h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.deleteMsg = '确认执行生效这条广播？';
                                        this.actionType = 'exec';
                                        this.$nextTick(() => {
                                            this.showModal = true;
                                            this.deleteId = params.row._id;
                                        });
                                    }
                                }
                            }, '执行生效');
                            let arr = [del, edit];
                            if (params.row.status && params.row.status === 1) {
                                arr.push(exec);
                            }
                            return h('div', arr);
                        }
                    }
                ],
                dataList: [],
                count: 1,
                params: {
                    activeGame: 0,
                    activeModel: 0,
                    status: 0,
                    page: 1,
                },
                gamesKey: {},
                gamesModel: ['', '积分赛', '朋友局'],
                status: ['', '等待', '生效', '过期', '失效'],
                showModal: false,
                loading: true,
                deleteMsg: '1111',
                deleteId: '',
                actionType: ''
            }
        },
        methods: {
            async getGames () {
                try {
                    const {status, data} = await getGamesList();
                    if (status.code !== 0) throw(new Error(status.message));
                    this.games = data.docs;
                    this.games.forEach(item => {
                        this.gamesKey[item._id] = item.gameName;
                    })
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            async getBroadcasts () {
                try {
                    const {status, data} = await getBroadcastList(this.params);
                    if (status.code !== 0) {
                        throw(new Error(status.message));
                    }
                    this.dataList = data.docs;
                    this.count = data.count;
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            addBroadcast () {
                this.$router.push('/add-broadcast');
            },
            search () {
                this.getBroadcasts();
            },
            filp (value) {
                this.params.page = value;
                this.getBroadcasts();
            },
            reset () {
                this.params.activeGame = 0;
                this.params.activeModel = 0;
                this.params.status = 0;
                this.params.page = 1;
                this.getBroadcasts();
            },
            async confirmDelete () {
                try {
                    if (this.actionType === 'delete') {
                        let {status} = await deleteBroadcastById(this.deleteId);
                        if (status.code !== 0) {
                            throw(new Error(status.message));
                        }
                        this.$Message.success('删除成功');
                    } else {
                        let {status} = await updateBroadcastById(this.deleteId, {status: 2});
                        if (status.code !== 0) {
                            throw(new Error(status.message));
                        }
                        this.$Message.success('生效成功');
                    }
                    this.getBroadcasts();
                    this.showModal = false;
                } catch(e) {
                    this.loading = false;
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                    errorHandle(e, this);
                }
            }
        },
        created () {
            this.getGames();
            this.getBroadcasts();
        }
    };
</script>

<style scoped>

</style>