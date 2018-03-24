<template>
    <div>
        <div class="search">
            <Row :gutter="16">
                <Col :span="4">
                    <Input v-model="params.playerId">
                    <span slot="prepend">玩家ID</span>
                </Input>
                </Col>
                <Col :span="4">
                    <Input v-model="params.playerAccount">
                    <span slot="prepend">玩家账号</span>
                </Input>
                </Col>
                <Col :span="4">
                    <DatePicker type="datetimerange" format="yyyy-MM-dd" placeholder="请选择时间范围" v-model="params.registerDate" style="width:100%;"></DatePicker>
                </Col>
                <Col :span="4">
                    <Button type="primary" @click="search">搜索</Button>
                    <Button type="default" @click="reset">重置</Button>
                </Col>
            </Row>
        </div>
        <div class="content" style="margin-top:15px;">
            <Table :columns="columns" :data="dataList"></Table>
        </div>
        <Modal
            v-model="showDetail"
            title="玩家详情"
        >
            <Row :gutter="8">
                <Col :span="3" style="text-align:right;"><strong>玩家id</strong></Col>
                <Col :span="5">{{activeDetail && activeDetail.shortId}}</Col>
                <Col :span="3" style="text-align:right;"><strong>玩家账号</strong></Col>
                <Col :span="5">{{activeDetail && activeDetail.mobileAuth.auth && activeDetail.mobileAuth.mobile || '暂无'}}</Col>
                <Col :span="3" style="text-align:right;"><strong>玩家昵称</strong></Col>
                <Col :span="5">{{activeDetail && activeDetail.nickname}}</Col>
                <Col :span="3" style="text-align:right;"><strong>真实姓名</strong></Col>
                <Col :span="5">{{activeDetail && activeDetail.realAuth.auth && activeDetail.realAuth.realname || '暂无'}}</Col>
                <Col :span="3" style="text-align:right;"><strong>身份证号</strong></Col>
                <Col :span="5">{{activeDetail && activeDetail.realAuth.auth && activeDetail.realAuth.addrCode || '暂无'}}</Col>
                <Col :span="3" style="text-align:right;"><strong>注册时间</strong></Col>
                <Col :span="5">{{activeDetail && activeDetail.realAuth.auth && activeDetail.realAuth.addrCode || '暂无'}}</Col>
                <Col :span="3" style="text-align:right;"><strong>状态</strong></Col>
                <Col :span="5">{{activeDetail && activeDetail.block}}</Col>
            </Row>
            <Row>
                <Col :span="10" :push="14" style="text-align:right; margin-top:15px;">
                    <Button type="error" v-if="activeDetail && !activeDetail.block" @click="banPlayer(activeDetail)">封号</Button>
                    <Button type="success" v-else @click="relieve(activeDetail)">解封</Button>
                </Col>
            </Row>
        </Modal>
        <div class="page">
            <Page :count="count" style="margin:15px; text-align:center;"></Page>
        </div>
    </div>
</template>

<script>
    import { getPlayerList, errorHandle, banPlayer, relievePlayer } from '../service';
    import moment from 'moment';
    export default {
        name: 'index',
        data () {
            return {
                columns: [
                    {
                        title: '玩家ID',
                        key: 'shortId'
                    },
                    {
                        title: '玩家账号',
                        key: 'mobile',
                        render: (h, params) => {
                            let account = '';
                            if (params.row.mobileAuth.auth) {
                                account = params.row.mobileAuth.mobile;
                            } else {
                                account = '暂无';
                            }
                            return h('span', account);
                        }
                    },
                    {
                        title: '玩家昵称',
                        key: 'nickname'
                    },
                    {
                        title: '真实姓名',
                        key: 'realname',
                        render: (h, params) => {
                            let realname = '';
                            if (params.row.realAuth.auth) {
                                realname = params.row.realAuth.realname;
                            } else {
                                realname = '暂无';
                            }
                            return h('span', realname);
                        }
                    },
                    {
                        title: '身份证号',
                        key: 'addrCode',
                        render: (h, params) => {
                            let addrCode = '';
                            if (params.row.realAuth.auth) {
                                addrCode = params.row.realAuth.addrCode;
                            } else {
                                addrCode = '暂无';
                            }
                            return h('span', addrCode);
                        }
                    },
                    {
                        title: '桌卡数',
                        key: 'card',
                        render: (h, params) => {
                            return h('span', params.row.coin.card);
                        }
                    },
                    {
                        title: '赛卡',
                        key: 'card',
                        render: (h) => {
                            return h('span', 0);
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createdAt',
                        width: 140,
                        render: (h, params) => {
                            return h('span', moment(params.row.createdAt).format('YYYY-MM-DD hh:mm'))
                        }
                    },
                    {
                        title: '最近登陆时间',
                        key: 'loginAt',
                        width: 140,
                        render: (h, params) => {
                            return h('span', moment(params.row.loginAt).format('YYYY-MM-DD hh:mm'))
                        }
                    },
                    {
                        title: '状态',
                        key: 'block',
                        render: (h, params) => {
                            return h('span', params.row.block ? '禁用' : '正常');
                        }
                    },
                    {
                        title: '操作',
                        key: 'actions',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.activeDetail = params.row;
                                        this.showDetail = true;
                                    }
                                }
                            }, '查看详情');
                        }
                    }
                ],
                dataList: [],
                params: {
                    page: 1,
                    playerId: '',
                    playerAccount: '',
                    registerDate: []
                },
                count: 0,
                showDetail: false,
                activeDetail: null
            }
        },
        methods: {
            search () {},
            reset () {},
            async getPlayerList () {
                try {
                    let {status, data} = await getPlayerList();
                    if (status.code !== 0) {
                        throw(new Error(status.message));
                    }
                    this.dataList = data.docs;
                    // this.$set(this, 'dataList', data.docs);
                    console.log(this.dataList)
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            async banPlayer (detail) {
                try {
                    let {status} = await banPlayer(detail._id);
                    if (status.code !== 0) throw(new Error(status.message));
                    detail.block = true;
                    this.$Message.success('操作成功');
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            async relieve (detail) {
                try {
                    let {status} = await relievePlayer(detail._id);
                    if (status.code !== 0) throw(new Error(status.message));
                    detail.block = false;
                    this.$Message.success('操作成功');
                } catch(e) {
                    errorHandle(e, this)
                }
            }
        },
        created () {
            this.getPlayerList();
        }
    };
</script>

<style scoped>

</style>