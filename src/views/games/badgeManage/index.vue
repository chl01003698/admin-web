<template>
    <div class="badge-manage">
        <div class="add-btn">
            <Button type="primary" @click.native="addBadge">添加角标</Button>
        </div>
        <div class="badge-list">
            <Table border :columns="column" :data="dataList"></Table>
        </div>
        <Page :total="count" @on-change="changePage" :style="{textAlign: 'center', margin: '15px'}"></Page>
        <Modal
            title="添加角标"
            v-model="isShow"
            :loading="loading"
            @on-ok="onOk"
        >
            <Row :style="{marginBottom: '10px'}">
                <Col :span="6" :style="{textAlign: 'center', lineHeight: '32px'}">名称</Col>
                <Col :span="18">
                    <Input type="text" v-model="subscriptName" />
                </Col>
            </Row>
            <Row>
                <Col :span="6" :style="{textAlign: 'center', lineHeight: '32px'}">图片</Col>
                <Col :span="18">
                    <Upload
                            ref="upload"
                            :action="uploadDomain"
                            :show-upload-list="false"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            :on-progress="uploadProgress"
                            accept="image/*"
                            :format="['jpg', 'png', 'gif']"
                            :on-format-error="formatError"
                >
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传缩略图</Button>
                    </Upload>
                    <template v-if="realImgSrc || (uploadFile && uploadFile.status === 'finished')">
                        <img width="150" :src="realImgSrc" style="margin-top:10px;" alt="">
                    </template>
                    <template v-else>
                        <Progress v-if="uploadFile && uploadFile.showProgress" :percent="uploadFile && uploadFile.percentage" hide-info></Progress>
                    </template>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import { addSubscript, getSubscriptList, deleteSubscriptById, updateSubscriptById, getImgFromOSS, uploadDomain, errorHandle } from '../service';
    export default {
        name: 'badgeMange',
        data () {
            return {
                column: [
                    {
                        title: '名称',
                        key: 'subscriptName'
                    },
                    {
                        title: '图片',
                        key: 'subscriptImg',
                        render (h, params) {
                            return h('div', {style: {padding: '10px'}}, [
                                h('img', {attrs: {src: params.row.realImgSrc, width: 150}})
                            ]);
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
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.isShow = true;
                                            this.isEdit = true;
                                            this.realImgSrc = getImgFromOSS(params.row.subscriptImg);
                                            this.subscriptImg = params.row.subscriptImg;
                                            this.subscriptName = params.row.subscriptName;
                                            this.editId = params.row._id;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除提醒',
                                                content: '确认删除此角标？',
                                                onOk: () => {
                                                    deleteSubscriptById(params.row._id).then(response => {
                                                        if (response.status.code === 0) {
                                                            this.fetchList();
                                                            this.$Message.success('删除成功');
                                                        }
                                                    }).catch(error => {
                                                        errorHandle(error, this);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                dataList: [
                    {
                        name: 123,
                        img: '12312313'
                    }
                ],
                loading: true,
                isShow: false,
                uploadFile: null,
                realImgSrc: '',
                subscriptImg: '',
                subscriptName: '',
                page: 1,
                count: 0,
                isEdit: false,
                editId: '',
                uploadDomain: uploadDomain
            };
        },
        methods: {
            addBadge () {
                this.isEdit = false;
                this.isShow = true;
                this.subscriptImg = '';
                this.subscriptName = '';
                this.realImgSrc = '';
            },
            onOk () {
                if (this.subscriptName === '') {
                    this.loading = false;
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                    return this.$Message.error('请输入角标名称');
                }
                if (this.subscriptImg === '') {
                    this.loading = false;
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                    return this.$Message.error('请上传角标图片');
                }
                if (this.isEdit) {
                    let params = {
                        subscriptName: this.subscriptName,
                        subscriptImg: this.subscriptImg
                    }
                    updateSubscriptById(this.editId, params).then(response => {
                        if (response.status.code === 0) {
                            this.resetData();
                            this.$Message.success('更新成功');
                            this.fetchList();
                        }
                    }).catch(error => {
                        this.loading = false;
                        errorHandle(error, this);
                        this.$nextTick(() => {
                            this.loading = true;
                        });
                    });
                    return false;
                }
                addSubscript({subscriptName: this.subscriptName, subscriptImg: this.subscriptImg}).then(response => {
                    if (response.status.code === 0) {
                        this.resetData();
                        this.$Message.success('添加成功');
                        this.fetchList();
                    }
                }).catch(error => {
                    console.log(error)
                    this.loading = false;
                    errorHandle(error, this);
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                });
            },
            uploadSuccess (response, file) {
                this.uploadFile = file;
                this.subscriptImg = response.data.url;
                this.realImgSrc = getImgFromOSS(response.data.url);
            },
            uploadError (error) {
                errorHandle(error, this);
            },
            uploadProgress (event, file) {
                this.uploadFile = file;
            },
            fetchList () {
                getSubscriptList(this.page).then(response => {
                    if (response.status.code === 0) {
                        this.dataList = response.data.docs;
                        this.dataList.forEach(content => {
                            content['realImgSrc'] = getImgFromOSS(content['subscriptImg']);
                        })
                        this.count = response.data.count;
                    }
                }).catch(error => {
                    errorHandle(error, this);
                });
            },
            changePage (page) {
                this.page = page;
                this.fetchList();
            },
            resetData () {
                this.isShow = false;
                this.subscriptImg = '';
                this.subscriptName = '';
                this.uploadFile = null;
            },
            formatError () {
                this.$Message.error('文件格式不正确')
            }
        },
        created () {
            this.fetchList();
        }
    };
</script>

<style scoped lang="less">
    .badge-list {
        margin-top:15px;
    }
</style>
