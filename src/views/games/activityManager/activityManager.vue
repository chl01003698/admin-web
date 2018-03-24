<template>
    <div class="activity-manager">
        <topActions v-on:searchActivity="searchActivity"></topActions>
        <Table :columns="columns" :data="dataList" border></Table>
        <Page :total="count" @on-change="changePage" show-total :styles="{textAlign: 'center', marginTop: '15px', marginBottom: '15px'}"></Page>
    </div>
</template>

<script>
    import '../../../libs/lazyload';
    import topActions from './components/topActions';
    import { activityList, arrActiveModel, getAllBadgeList, arrActionStatus, getImgFromOSS, moveItemUpOrDown, getActivityItemByPage, delActivityById, errorHandle } from '../service';
    import dateformat from 'dateformat';
    export default {
        name: 'activity-manager',
        components: {
            topActions
        },
        data () {
            return {
                columns: [
                    {
                        title: '编号ID',
                        key: 'index',
                        render: (h, params) => {
                            return h('span', params.index + 1);
                        }
                    },
                    {
                        title: '名称',
                        key: 'activityName'
                    },
                    {
                        title: '描述',
                        key: 'activityDescription'
                    },
                    {
                        title: '图片',
                        key: 'activityImg',
                        render: (h, params) => {
                            let imgSrc = require('@/images/ajax-loader.gif');
                            let i = new Image();
                            i.src = params.row.activityImg;
                            i.onload = function () {
                                imgSrc = i.src;
                            }
                            return h('div', {style: {padding: '10px 0'}}, [
                                h('img', {
                                    attrs: {
                                        src: params.row.activityImg,
                                        width: '100%'
                                    }
                                })
                            ]);
                        },
                        width: '200'
                    },
                    {
                        title: '生效APP',
                        key: 'activeGame',
                        render: (h, params) => {
                            // return h('span', params.row.activeGame);
                            return h('span', this.gameList[params.row.activeGame]);
                        }
                    },
                    {
                        title: '生效模式',
                        key: 'activeModel'
                    },
                    {
                        title: '跳转链接',
                        key: 'jumpLink'
                    },
                    {
                        title: '角标',
                        key: 'subscriptName'
                    },
                    {
                        title: '生效时间',
                        key: 'startAt',
                        render: (h, params) => {
                            return h('span', dateformat(params.row.startAt, 'yyyy-mm-dd HH:MM'));
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'endAt',
                        render: (h, params) => {
                            return h('span', dateformat(params.row.endAt, 'yyyy-mm-dd HH:MM'));
                        }
                    },
                    {
                        title: '状态',
                        key: 'status'
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
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push('/editActivity/' + params.row._id);
                                        }
                                    }
                                }, '编辑'),
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
                                            this.delActivity(params.row);
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small',
                                        disabled: params.index === 0 && !this.hasPrevPage
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let currentId = params.row._id;
                                            let moveId = this.dataList[(params.index - 1)] && this.dataList[(params.index - 1)]['_id'];
                                            if (moveId) {
                                                moveItemUpOrDown(currentId, moveId).then((response) => {
                                                    if (response.status.code !== 0) {
                                                        return this.$Message.error('操作失败');
                                                    }
                                                    this.$Message.success('操作成功');
                                                    this.fetchList(this.params);
                                                });
                                            } else {
                                                this.getActivityIdByPage(false).then(data => {
                                                    moveItemUpOrDown(currentId, data['_id']).then(response => {
                                                        if (response.status.code !== 0) {
                                                            return this.$Message.error('操作失败');
                                                        }
                                                        this.$Message.success('操作成功');
                                                        this.fetchList(this.params);
                                                    });
                                                });
                                            }
                                        }
                                    }
                                }, '上移'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small',
                                        disabled: this.dataList.length === (params.index + 1) && !this.hasNextPage
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let currentId = params.row._id;
                                            let moveId = this.dataList[(params.index + 1)] && this.dataList[(params.index + 1)]['_id'];
                                            if (moveId) {
                                                moveItemUpOrDown(currentId, moveId).then(response => {
                                                    if (response.status.code !== 0) {
                                                        return this.$Message.error('操作失败');
                                                    }
                                                    this.$Message.success('操作成功');
                                                    this.fetchList(this.params);
                                                });
                                            } else {
                                                this.getActivityIdByPage(true).then(data => {
                                                    moveItemUpOrDown(currentId, data['_id']).then(response => {
                                                        if (response.status.code !== 0) {
                                                            return this.$Message.error('操作失败');
                                                        }
                                                        this.$Message.success('操作成功');
                                                        this.fetchList(this.params);
                                                    });
                                                });
                                            }
                                        }
                                    }
                                }, '下移')
                            ]);
                        },
                        width: '230px'
                    }
                ],
                dataList: [],
                count: 0,
                totalPage: 0,
                params: {
                    page: 1
                },
                gameList: [],
                badgeList: {}
            };
        },
        methods: {
            fetchList (params) {
                activityList(params).then(response => {
                    if (response.status.code === 0) {
                        this.dataList = response.data.docs;
                        this.dataList.forEach(content => {
                            content.activeModel = arrActiveModel[content.activeModel];
                            content.status = arrActionStatus[content.status];
                            content.jumpLink = content.jumpLink || '未填';
                            content.activityImg = getImgFromOSS(content.activityImg);
                            content.subscriptName = this.badgeList[content.subscript];
                        });
                        this.count = response.data.count;
                        this.totalPage = Math.ceil(this.count / 10);
                        this.$nextTick(() => {
                            this.gameList = this.$store.state.app.GameList;
                        });
                    }
                }).catch(error => {
                    errorHandle(error, this);
                });
            },
            changePage (value) {
                this.params.page = value;
                this.fetchList({page: this.params.page});
            },
            getActivityIdByPage (isNext) {
                let page = this.params.page;
                page = isNext ? (page + 1) : (page - 1);
                return new Promise((resolve, reject) => {
                    getActivityItemByPage(page).then(response => {
                        if (response.status.code === 0) {
                            if (isNext) {
                                resolve(response.data.docs[0]);
                            } else {
                                resolve(response.data.docs[9]);
                            }
                        }
                    }).catch(error => {
                        errorHandle(error, this);
                    });
                });
            },
            delActivity (item) {
                let data = [
                    {
                        name: '名称',
                        value: item.activityName
                    },
                    {
                        name: '描述',
                        value: item.activityDescription
                    },
                    {
                        name: '生效APP',
                        value: item.activityName
                    },
                    {
                        name: '生效模式',
                        value: item.activeGame
                    },
                    {
                        name: '图片',
                        value: item.activityImg
                    },
                    {
                        name: '生效时间',
                        value: dateformat(item.startAt, 'yyyy-mm-dd HH:MM') + ' - ' + dateformat(item.endAt, 'yyyy-mm-dd HH:MM')
                    },
                    {
                        name: '当前状态',
                        value: item.status
                    },
                    {
                        name: '跳转链接',
                        value: item.jumpLink
                    },
                    {
                        name: '角标',
                        value: item.activitySortFlag
                    }
                ];
                this.$Modal.confirm({
                    render: (h) => {
                        return h('div', [
                            h('h2', {
                                style: {
                                    textAlign: 'center',
                                    color: 'red',
                                    marginBottom: '15px'
                                }
                            }, '确认删除此信息？'),
                            h('Table', {
                                props: {
                                    columns: [
                                        {
                                            title: '名称',
                                            key: 'name'
                                        },
                                        {
                                            title: '值',
                                            key: 'value',
                                            render: (h, params) => {
                                                if (params.row.name === '图片') {
                                                    return h('img', {
                                                        attrs: {
                                                            src: params.row.value,
                                                            width: '100'
                                                        }
                                                    });
                                                } else {
                                                    return h('span', params.row.value);
                                                }
                                            }
                                        }
                                    ],
                                    data: data
                                }
                            })
                        ]);
                    },
                    onOk: () => {
                        delActivityById(item['_id']).then(response => {
                            if (response.status.code === 0) {
                                this.$Message.success('删除成功');
                                this.fetchList({page: this.params.page});
                            }
                        }).catch(error => {
                            errorHandle(error, this);
                        });
                    },
                    'width': '650px',
                    okText: '确认删除'
                });
            },
            searchActivity (params) {
                this.params = params;
                this.fetchList(this.params);
            },
            fetchBadgeList () {
                getAllBadgeList().then(response => {
                    if (response.status.code === 0) {
                        let tmp = {};
                        response.data.docs.forEach(content => {
                            tmp[content._id] = content.subscriptName;
                        });
                        this.badgeList = tmp;
                    }
                }).catch(error => {
                    errorHandle(error, this);
                });
            }
        },
        created () {
            setTimeout(() => {
                this.gameList = this.getGameList;
                this.fetchBadgeList();
                this.fetchList(this.params);
            }, 0);
        },
        computed: {
            // 有下一页
            hasNextPage () {
                return this.totalPage > this.params.page;
            },
            // 有上一页
            hasPrevPage () {
                return this.params.page > 1 && this.totalPage > 1;
            },
            getGameList () {
                return this.$store.state.app.GameList;
            }
        }
    };
</script>

<style scoped>
    .top-actions {
        margin-top: 15px;
        margin-bottom:20px;
    }
</style>
