<template>
    <div>
        <div class="topAction">
            <Row>
                <Col :span="2">
                    <Button type="default">返回</Button>
                </Col>
                <Col :span="22">
                    <h3 style="text-align:center;line-height:32px;font-size:22px;">为 <span style="color:darkred;">{{decodeURI(groupName)}}</span> 分配成员</h3>
                </Col>
            </Row>
        </div>
        <div class="search" style="margin-top:15px;">
            <Row :gutter="14">
                <Col :span="3">
                    <Input v-model="nickname"><span slot="prepend">昵称</span></Input>
                </Col>
                <Col :span="3">
                    <Input v-model="username"><span slot="prepend">用户名</span></Input>
                </Col>
                <Col :span="2">
                    <Button long type="primary" @click="search">搜索</Button>
                </Col>
                <Col :span="2">
                    <Button long type="warning" @click="reset">重置</Button>
                </Col>
            </Row>
        </div>
        <div class="content" style="margin-top:15px;">
            <Table border :columns="columns" :data="dataList"></Table>
        </div>
        <Modal
                v-model="confirm"
                title="温馨提示"
                :loading="confirmLoading"
                @on-ok="confirmOK">
            <p>{{confirmContent}}</p>
        </Modal>
    </div>
</template>

<script>
    import { getGroupUsers, errorHandle, getUserList, removeUserFromGroup, addUserToGroup } from '../../service';
    import _ from 'lodash'
    export default {
        name: 'assign-members',
        data () {
            return {
                nickname: '',
                username: '',
                groupId: '',
                groupName: '',
                confirm: false,
                confirmContent: '',
                confirmLoading: true,
                confirmAction: '',
                confirmActionUserId: '',
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
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            let status = params.row.status === 0 ? '正常' : '禁用';
                            return h('span', status);
                        }
                    },
                    {
                        title: '操作',
                        key: 'email',
                        render: (h, params) => {
                            let btn = null;
                            console.log(params.row.group)
                            console.log(this.groupId)
                            if (params.row.inGroup) {
                                btn = h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.confirmContent = '确认将用户 ' + params.row.username + ' 移除出该组？';
                                            this.confirmAction = 'remove';
                                            this.confirmActionUserId = params.row._id;
                                            this.$nextTick(() => {
                                                this.confirm = true;
                                            })
                                        }
                                    }
                                }, '从本用户组移除')
                            } else {
                                btn = h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.confirmContent = '确认将用户 ' + params.row.username + ' 移至该组？';
                                            this.confirmAction = 'add';
                                            this.confirmActionUserId = params.row._id;
                                            this.$nextTick(() => {
                                                this.confirm = true;
                                            })
                                        }
                                    }
                                }, '添加用户至本组')
                            }
                            return h('div', [btn])
                        }
                    }
                ],
                dataList: [],
                page: 1,
                count: 0
            }
        },
        methods: {
            async getGroupUsers () {
                try {
                    let {status, data} = await getGroupUsers(this.groupId);
                    if (status.code !== 0) {
                        return this.$Message.error(status.message);
                    }
                    data.docs.forEach(item => {
                        item.inGroup = true;
                        _.assignIn(item, _.pick(item, ['user']).user)
                    })
                    this.dataList = data.docs;
                    this.count = data.count;
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            goBack () {
                this.$store.commit('removeTag', 'assign-member');
                this.$router.push(-1);
            },
            async search () {
                try {
                    this.page = 1;
                    let params = {page: this.page};
                    if (this.username) params.username = this.username;
                    if (this.nickname) params.nickname = this.nickname;
                    let {status, data} = await getUserList(params);
                    if (status.code !== 0) {
                        return this.$Message.error(status.message);
                    }
                    data.docs.forEach(item => {
                        console.log(item.group)
                        console.log(item.group, decodeURI(this.groupName), decodeURI(this.groupName) === item.group)
                        item.inGroup = false;
                        if (item.group == decodeURI(this.groupName)) {
                            item.inGroup = true;
                        }
                    })
                    this.dataList = data.docs;
                    this.count = data.count;
                } catch (e) {
                    errorHandle(e, this);
                }
            },
            reset () {
                this.page = 0;
                this.username = '';
                this.nickname = '';
                this.getGroupUsers();
            },
            async confirmOK () {
                try {
                    if (this.confirmAction === 'remove') {
                        let {status} = await removeUserFromGroup(this.groupId, this.confirmActionUserId)
                        if (status.code !== 0) {
                            this.resetConfirmStatus();
                            return this.$Message.error(status.message);
                        }
                        this.$Message.success('操作成功');
                        this.confirm = false;
                        this.$delete(this.dataList, _.findIndex(this.dataList, {'_id': this.confirmActionUserId}));
                    } else if (this.confirmAction === 'add') {
                        let {status} = await addUserToGroup(this.groupId, this.confirmActionUserId);
                        if (status.code !== 0) {
                            this.resetConfirmStatus();
                            return this.$Message.error(status.message);
                        }
                        this.$Message.success('操作成功');
                        this.confirm = false;
                        this.dataList[_.findIndex(this.dataList, {'_id': this.confirmActionUserId})]['inGroup'] = true;
                    }
                } catch(e) {
                    errorHandle(e, this);
                    this.resetConfirmStatus();
                }
            },
            resetConfirmStatus () {
                this.confirmLoading = false;
                this.$nextTick(() => {
                    this.confirmLoading = true;
                })
            }
        },
        created () {
            this.groupId = this.$route.params.group_id;
            this.groupName = location.href.split('=')[1];
            if (!this.groupId) {
                this.$Message.error('未找到该用户组');
                return this.goBack();
            }
            this.getGroupUsers()
        }
    };
</script>

<style scoped>

</style>