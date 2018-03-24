<template>
    <div>
        <div class="topActions">
            <Row :gutter="8">
                <Col span="1" style="text-align:right; line-height:32px;">
                    状态
                </Col>
                <Col span="2">
                    <Select v-model="params.status">
                        <Option :value="0">全部</Option>
                        <Option :value="1">正常</Option>
                        <Option :value="2">已发放</Option>
                        <Option :value="3">失效</Option>
                    </Select>
                </Col>
                <Col span="2" style="text-align:right; line-height:32px;">
                    录入时间
                </Col>
                <Col span="5">
                    <DatePicker v-model="params.choiceDate" format="yyyy-MM-dd" type="daterange" placement="bottom-end" style="width:100%;"></DatePicker>
                </Col>
                <Col span="2">
                    <Button type="primary" long @click="search">搜索</Button>
                </Col>
                <Col span="2">
                    <Button type="warning" long @click="reset">重置</Button>
                </Col>
                <Col span="4" push="6" style="text-align:right;">
                    <!--<Button type="primary">批量处理</Button>-->
                    <Button type="primary" @click="addCard">添加</Button>
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
            :loading="loading"
            title="提示"
            @on-ok="deleteAction"
        >
            确认删除此条数据？
        </Modal>
    </div>
</template>

<script>
    import { getJDCardList, errorHandle, deleteJDCardById } from '../service';
    import moment from 'moment';
    export default {
        name: "index",
        data() {
            return {
                params: {
                    page: 1,
                    status: 0,
                    choiceDate: [],
                    start: '',
                    end: ''
                },
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        render: (h, params) => {
                            return h('span', params.index + 1)
                        }
                    },
                    {
                        title: '京东卡号',
                        key: 'cardNumber'
                    },
                    {
                        title: '面额',
                        key: 'denomination'
                    },
                    {
                        title: '录入时间',
                        key: 'createdAt',
                    },
                    // {
                    //     title: '发送目标手机',
                    //     key: 'sendTarget'
                    // },
                    // {
                    //     title: '发送时间',
                    //     key: 'sendDate'
                    // },
                    {
                        title: '状态',
                        key: 'strStatus'
                    },
                    {
                        title: '操作',
                        key: 'status',
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
                                        click: () => {
                                            this.showModal = true;
                                            this.activeCard = params.row._id;
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push('/edit-card/' + params.row._id);
                                        }
                                    }
                                }, '编辑')
                            ])
                        }
                    }
                ],
                dataList: [],
                count: 0,
                status: ['', '正常', '已发放', '失效'],
                showModal: false,
                loading: true,
                activeCard: ''
            }
        },
        methods: {
            addCard () {
                this.$router.push('/add-card')
            },
            async getJDCardList () {
                try {
                    let params = JSON.parse(JSON.stringify(this.params));
                    delete params.choiceDate;
                    let {status, data} = await getJDCardList(params);
                    if (status.code !== 0) {
                        throw(new Error(status.message));
                    }
                    data.docs.forEach(item => {
                        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD hh:mm');
                        item.strStatus = this.status[item.status]
                    })
                    this.dataList = data.docs;
                    this.count = data.count;
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            search () {
                this.getJDCardList();
            },
            reset () {
                this.params.page = 1;
                this.params.status = 0;
                this.params.choiceDate = [];
                this.params.start = '';
                this.params.end = '';
                this.getJDCardList();
            },
            async deleteAction () {
                try {
                    let {status} = await deleteJDCardById(this.activeCard);
                    if (status.code !== 0) {
                        throw(new Error(status.message));
                    }
                    this.$Message.success('操作成功');
                    this.getJDCardList();
                    this.showModal = false;
                } catch(e) {
                    errorHandle(e, this);
                    this.loading = false;
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                }
            },
            filp (val) {
                console.log(val)
                this.params.page = val;
                this.getJDCardList();
            }
        },
        created() {
            this.getJDCardList();
        },
        watch: {
            'params.choiceDate': function (val) {
                val[0] ? this.params.start = moment(val[0]).format('YYYY-MM-DD') : '';
                val[1] ? this.params.end = moment(val[1]).format('YYYY-MM-DD') : '';
            }
        }
    }
</script>

<style scoped>

</style>