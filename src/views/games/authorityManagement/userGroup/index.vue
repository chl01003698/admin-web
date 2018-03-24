<template>
    <div class="container">
        <div class="actions">
            <Button type="primary" @click="addUserGroup('添加用户组', 1)">添加用户组</Button>
        </div>
        <div class="content" style="margin-top:15px;">
            <Table :columns="columns" :data="dataList"></Table>
        </div>
        <div class="page" style="margin-top:15px; text-align:center;">
            <Page :total="total" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
import { addUserGroup, getUserGroupById, getUserGroupList, updateUserGroupById } from '../../service';
export default {
    name: 'index',
    data () {
        return {
            columns: [
                {
                    title: '用户组名',
                    key: 'groupName',
                    render: (h, params) => {
                        return h('span', params.row.groupName);
                    }
                },
                {
                    title: '操作',
                    key: 'actions',
                    width: 300,
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
                                        getUserGroupById(params.row._id).then(response => {
                                            if (response.status.code === 0) {
                                                this.addGroupData.groupName = response.data.groupName;
                                                this.addUserGroup('编辑用户组', 0, params.row._id);
                                            }
                                        }).catch(error => {
                                            console.log(error);
                                        });
                                    }
                                }
                            }, '修改'),
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
                                        this.$router.push('/assign-permission/' + params.row._id);
                                    }
                                }
                            }, '分配权限'),
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
                                        this.$router.push({
                                            path: '/assign-member/' + params.row._id,
                                            query: {
                                                group_name: params.row.groupName
                                            }
                                        });
                                    }
                                }
                            }, '分配成员')
                        ]);
                    }
                }
            ],
            dataList: [],
            addGroupData: {
                groupName: ''
            },
            rulesGroupData: {
                groupName: [
                    {
                        required: true,
                        message: '用户组名不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            page: 1,
            total: 0
        };
    },
    methods: {
        addUserGroup (title, isAdd, id = null) {
            if (isAdd) {
                this.addGroupData.groupName = '';
            }
            this.$Modal.confirm({
                title: title,
                render: (h) => {
                    return h('Form', {
                        props: {
                            model: this.addGroupData,
                            rules: this.rulesGroupData,
                            'label-width': 100
                        }
                    }, [
                        h('FormItem', {
                            props: {
                                prop: 'groupName',
                                label: '用户组名称'
                            }
                        }, [
                            h('Input', {
                                props: {
                                    value: this.addGroupData.groupName,
                                    placeholder: '请填写用户组名称'
                                },
                                on: {
                                    input: (value) => {
                                        this.addGroupData.groupName = value;
                                    }
                                }
                            })
                        ])
                    ]);
                },
                loading: true,
                onOk: () => {
                    if (this.addGroupData.groupName === '') {
                        this.$Message.error('请填写正确的用户组名称');
                        this.addGroupData.groupName = '';
                        return this.$Modal.remove();
                    }
                    if (isAdd) {
                        addUserGroup(this.addGroupData).then(response => {
                            if (response.status.code === 0) {
                                this.$Message.success('添加成功');
                                this.fetchList();
                                return this.$Modal.remove();
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    } else {
                        updateUserGroupById(id, this.addGroupData).then(response => {
                            if (response.status.code === 0) {
                                this.$Message.success('更新成功');
                                this.fetchList();
                                return this.$Modal.remove();
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }
            });
        },
        fetchList () {
            getUserGroupList(this.page).then(response => {
                if (response.status.code === 0) {
                    this.dataList = response.data.docs;
                    this.total = response.data.count;
                }
            }).catch(error => {
                console.log(error);
            });
        },
        changePage (value) {
            this.page = value;
            this.fetchList();
        }
    },
    created () {
        this.fetchList();
    }
};
</script>

<style scoped>

</style>