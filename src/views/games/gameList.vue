<template>
    <div class="game-list">
        <Button type="primary" :style="{marginBottom: '15px'}" @click.native="isShow = true">添加游戏</Button>
        <Table :columns="cols" :data="list" :stripe="true"></Table>
        <Page :total="count" show-total @on-change="changePage" :current="page" :styles="{textAlign: 'center', marginTop: '15px', marginTop: '10px'}"></Page>
        <Modal v-model="isShow" title="添加游戏" @on-ok="addGame" @on-cancel="cancelAdd" :loading="isLoading" :value="isShow">
            <Row :style="{marginBottom: '15px'}">
                <Col span="4" :style="{textAlign: 'center', fontSize: '16px', lineHeight: '32px'}">游戏ID</Col>
                <Col span="20">
                    <Input type="text" v-model="gameID" />
                </Col>
            </Row>
            <Row>
                <Col span="4" :style="{textAlign: 'center', fontSize: '16px', lineHeight: '32px'}">游戏名称</Col>
                <Col span="20">
                    <Input type="text" v-model="gameName"/>
                </Col>
            </Row>
        </Modal>

        <Modal v-model="isShowEdit" title="编辑游戏" @on-ok="editGame" @on-cancel="cancelAdd" :loading="isLoading" :value="isShowEdit">
            <Row :style="{marginBottom: '15px'}">
                <Col span="4" :style="{textAlign: 'center', fontSize: '16px', lineHeight: '32px'}">游戏ID</Col>
                <Col span="20">
                <Input type="text" v-model="tmp && tmp.gameId" />
                </Col>
            </Row>
            <Row>
                <Col span="4" :style="{textAlign: 'center', fontSize: '16px', lineHeight: '32px'}">游戏名称</Col>
                <Col span="20">
                <Input type="text" v-model="tmp && tmp.gameName"/>
                </Col>
            </Row>
        </Modal>
    </div>
</template>


<script>
    import { addGameAction, fetchGameList, delGameById, editGameById } from './service/gameActions';
    export default {
        name: 'game-list',
        data () {
            return {
                cols: [
                    {
                        title: '游戏ID',
                        key: 'gameId'
                    },
                    {
                        title: '游戏名称',
                        key: 'gameName'
                    },
                    {
                        title: '操作',
                        key: 'actions',
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
                                            let row = params.row;
                                            this.$Modal.confirm({
                                                title: '删除',
                                                content: `<p>游戏名称：${row.gameName}</p><p>游戏ID：${row.gameId}</p><h3>确认<span style="color:red;">删除</span>该游戏？</h3>`,
                                                onOk: () => {
                                                    delGameById(row._id).then(data => {
                                                        this.fetchList();
                                                        this.$Message.success(data.msg);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, '删除'),
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
                                            let row = params.row;
                                            this.isShowEdit = true;
                                            this.tmp = {gameId: row.gameId, gameName: row.gameName};
                                            this.tmpId = row._id;
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                list: [],
                index: 1,
                originList: [],
                dataList: [],
                isShow: false,
                isLoading: true,
                gameID: '',
                gameName: '',
                size: 10,
                page: 1,
                count: 0,
                isEdit: false,
                isShowEdit: false,
                tmp: {},
                tmpId: ''
            };
        },
        methods: {
            addGame () {
                this.isShow = false;
                if (this.gameID === '') {
                    return this.$Message.error('请输入游戏ID');
                }
                if (this.gameName === '') {
                    return this.$Message.error('请输入游戏名称');
                }
                addGameAction({
                    gameId: this.gameID,
                    gameName: this.gameName
                }).then(data => {
                    this.gameID = '';
                    this.gameName = '';
                    this.$Message.success(data.msg);
                    this.fetchList();
                }).catch(error => {
                    this.gameID = '';
                    this.gameName = '';
                    this.$Message.error(error.status.message);
                });
            },
            editGame () {
                this.isShowEdit = false;
                editGameById(this.tmpId, this.tmp).then(data => {
                    this.$Message.success(data.msg);
                    this.fetchList();
                }).catch(error => {
                    this.$Message.error(error.status.message);
                });
            },
            cancelAdd () {},
            fetchList () {
                fetchGameList(this.page).then(data => {
                    this.count = data.count;
                    this.list = data.list;
                }).catch(error => {
                    console.log(error);
                });
            },
            changePage (page) {
                this.page = page;
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
