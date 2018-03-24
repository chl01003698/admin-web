<template>
    <div class="parameter-list" :style="{minHeight: '100%', height: '100%'}">
        <Table v-show="isList" border :columns="columns" :data="dataList"></Table>
        <div v-show="!isList" class="editParameter" style="height:100%;">
            <div class="actions">
                <Button @click.native="goBackList">返回列表</Button>
                <Button type="primary" @click.native="postData">提交编辑</Button>
            </div>
            <div class="gameInfo" style="margin-bottom:15px;margin-top:15px;">
                <span>编号：{{editData._index + 1}}</span>
                <span>描述：{{editData.description}}</span>
                <span>生效APP：{{editData.activeGame}}</span>
            </div>
            <Row :style="{height: '80%'}">
                <Col span="11" :style="{height: '100%'}">
                    <div id="jsontexteditor" :style="{height: '100%'}"></div>
                </Col>
                <Col span="2" :style="{textAlign: 'center', height: '100%'}">
                    <div style="position:relative; top:50%; transform: translateY(-50%)">
                        <Button @click.native="Json2Code"><Icon type="arrow-left-b"></Icon></Button>
                        <Button @click.native="Code2Json"><Icon type="arrow-right-b"></Icon></Button>
                    </div>
                </Col>
                <Col span="11" :style="{height: '100%'}">
                    <div id="jsoneditor" :style="{height: '100%'}"></div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    import { paramterList, editParamter, errorHandle } from '../service';
    import JSONEditor from 'jsoneditor';
    import _ from 'lodash';
    import 'jsoneditor/dist/jsoneditor.css';
    export default {
        name: 'parameter-list',
        data () {
            return {
                columns: [
                    {
                        title: '编号ID',
                        key: 'id',
                        render: (h, params) => {
                            return h('span', null, params.index + 1);
                        }
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                    {
                        title: '生效APP',
                        key: 'activeGame'
                    },
                    {
                        title: '最近修改时间',
                        key: 'updateAt'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    on: {
                                        click: () => {
                                            this.isList = false;
                                            this.editData = params.row;
                                            let json = this.editData.parameterData || {};
                                            this.JSONeditor.set(json);
                                            this.JSONTextEditor.set(json);
                                        }
                                    }
                                }, '编辑参数')
                            ]);
                        }
                    }
                ],
                dataList: [],
                isList: true,
                editData: {},
                JSONeditor: null,
                JSONTextEditor: null
            };
        },
        methods: {
            fetchList () {
                paramterList().then(response => {
                    let data = response.data;
                    this.dataList = data.docs;
                }).catch(error => {
                    errorHandle(error, this);
                });
            },
            goBackList () {
                this.isList = true;
            },
            Json2Code () {
                this.JSONTextEditor.set(this.JSONeditor.get());
            },
            Code2Json () {
                this.JSONeditor.set(this.JSONTextEditor.get());
            },
            postData () {
                let leftData = this.JSONTextEditor.get();
                let rightData = this.JSONeditor.get();
                if (!_.isEqual(leftData, rightData)) {
                    return this.$Message.error('两边数据不一致');
                }
                editParamter(this.editData._id, {parameterData: leftData}).then(response => {
                    if (response.status.code === 0) {
                        this.$Message.success('编辑成功');
                    }
                    this.fetchList();
                    this.isList = true;
                }).catch(error => {
                    errorHandle(error, this);
                });
            }
        },
        created () {
            this.fetchList();
        },
        mounted () {
            const container = document.getElementById('jsoneditor');
            const textContainer = document.getElementById('jsontexteditor');
            const jsonOptions = {'mode': 'tree'};
            const textOptions = {'mode': 'code'};
            this.JSONeditor = new JSONEditor(container, jsonOptions);
            this.JSONTextEditor = new JSONEditor(textContainer, textOptions);
        }
    };
</script>

<style scoped lang="less">
    .parameter-list {
        display:block;
        min-height:100%;
    }
    .gameInfo {
        font-size:14px;
        font-weight: bold;
        span {
            display:inline-block;
            margin-right:20px;
        }
    }
</style>
