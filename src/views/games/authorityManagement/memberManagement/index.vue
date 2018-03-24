<template>
    <div>
        <div class="topAction">
            <Row :gutter="16">
                <Col :span="4">
                    <Input v-model="searchParams.nickname">
                        <span slot="prepend">昵称</span>
                    </Input>
                </Col>
                <Col :span="4">
                    <Input v-model="searchParams.username">
                        <span slot="prepend">账号</span>
                    </Input>
                </Col>
                <Col :span="4">
                    <DatePicker type="datetimerange" format="yyyy-MM-dd" placeholder="请选择创建时间" v-model="searchDate" style="width:100%;"></DatePicker>
                </Col>
                <Col :span="4">
                    <Button type="primary" @click="search">搜索</Button>
                    <Button type="default" @click="reset">重置</Button>
                </Col>
                <Col :span="2" :push="6">
                    <Button long type="warning" @click="addUser">添加账号</Button>
                </Col>
            </Row>
        </div>
        <div class="container" style="margin-top:15px;">
            <Table :columns="columns" :data="dataList"></Table>
        </div>
        <div class="page" style="margin:15px; text-align:center;">
            <Page :total="count" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    import { getUserList, errorHandle } from '@/views/games/service';
    import moment from 'moment';
    export default {
        name: 'index',
        data () {
            return {
                nickname: '',
                account: '',
                startDate: '',
                endDate: '',
                count: 0,
                columns: [
                    {
                        title: '账号',
                        key: 'username'
                    },
                    {
                        title: '昵称',
                        key: 'nickname'
                    },
                    {
                        title: '手机号',
                        key: 'mobile'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '创建时间',
                        key: 'createdAt'
                    },
                    {
                        title: '最后一次登录时间',
                        key: 'last_login_time',
                        render (h, params) {
                            let last_login_time = params.row.last_login_time ? params.row.last_login_time : '暂无';
                            return h('span', last_login_time);
                        }
                    },
                    {
                        title: '最后一次登录IP',
                        key: 'last_login_ip',
                        render (h, params) {
                            let last_login_ip = params.row.last_login_ip ? params.row.last_login_ip : '暂无';
                            return h('span', last_login_ip);
                        }
                    },
                    {
                        title: '用户组',
                        key: 'group'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render (h, params) {
                            let status = params.row.status === 0 ? '正常' : '禁用';
                            return h('span', status);
                        }
                    },
                    {
                        title: '操作',
                        key: 'actions',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push('/edit-user/' + params.row._id);
                                        }
                                    }
                                }, '编辑')
                            ])
                        }
                    }
                ],
                dataList: [],
                searchParams: {
                    nickname: '',
                    username: '',
                    start: '',
                    end: '',
                    page: 1
                },
                searchDate: ''
            }
        },
        methods: {
            async getUserListByPage () {
                try {
                    let {status, data} = await getUserList(this.searchParams);
                    if (status.code !== 0) {
                        return this.$Message.error(status.message);
                    }
                    this.dataList = data.docs;
                    this.count = data.count;
                } catch (e) {
                    errorHandle(e, this);
                }
            },
            search () {
                this.searchParams.page = 1;
                this.getUserListByPage(this.searchParams);
            },
            addUser () {
                this.$router.push('/add-user')
            },
            changePage (value) {
                this.params.page = value;
                this.getUserListByPage();
            },
            reset () {
                this.searchParams.nickname = '';
                this.searchParams.username = '';
                this.searchDate = [];
                this.searchParams.page = 1;
                this.getUserListByPage(this.searchParams);
            }
        },
        created () {
            this.getUserListByPage(this.searchParams);
        },
        watch: {
            searchDate (value) {
                if (value[0] && value[1]) {
                    this.searchParams.start = moment(value[0]).format('YYYY-MM-DD');
                    this.searchParams.end = moment(value[1]).format('YYYY-MM-DD');
                } else {
                    this.searchParams.start = '';
                    this.searchParams.end = '';
                }
            }
        }
    };
</script>

<style scoped>

</style>