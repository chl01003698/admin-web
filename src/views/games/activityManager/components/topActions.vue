<template>
    <div class="top-actions">
        <Row>
            <!--<Col span="2" :style="{textAlign:'center', lineHeight: '32px', fontSize: '14px', fontWeight: 'bold'}">活动名称</Col>-->
            <Col span="4">
                <Input type="text" v-model="params.activityName" value="">
                    <span slot="prepend">活动名称</span>
                </Input>
            </Col>

            <Col span="2" :style="{textAlign:'center', lineHeight: '32px', fontSize: '14px', fontWeight: 'bold'}">生效APP</Col>
            <Col span="2">
                <Select v-model="params.activeGame" clearable>
                    <Option v-for="item in appList" :value="item._id" :key="item.key">{{item.gameName}}</Option>
                </Select>
            </Col>

            <Col span="2" :style="{textAlign:'center', lineHeight: '32px', fontSize: '14px', fontWeight: 'bold'}">生效模式</Col>
            <Col span="2">
            <Select v-model="params.activeModel" clearable>
                <Option v-for="item in modeList" :value="item.value" :key="item.key">{{item.label}}</Option>
            </Select>
            </Col>
            <Col span="2" :style="{textAlign:'center', lineHeight: '32px', fontSize: '14px', fontWeight: 'bold'}">状态</Col>
            <Col span="2">
            <Select v-model="params.status" clearable>
                <Option v-for="item in stateList" :value="item.value" :key="item.key">{{item.label}}</Option>
            </Select>
            </Col>
            <Col span="4">
            <Button type="primary" :style="{marginLeft: '10px'}" @click.native="searchActivity">搜索</Button>
            <Button type="warning" :style="{marginLeft: '10px'}" @click.native="resetSearch">重置</Button>
            </Col>
            <Col span="4" :push="2">
                <Button type="primary" size="large" @click.native="addActivity" :style="{marginLeft: '10px'}">添加活动</Button>
            </Col>
        </Row>
    </div>
</template>

<script>
    import { getGamesList, errorHandle } from '../../service';
    export default {
        name: 'top-actions1',
        data () {
            return {
                modeList: [
                    {
                        value: '1',
                        label: '积分赛'
                    },
                    {
                        value: '2',
                        label: '好友局'
                    }
                ],
                stateList: [
                    {
                        value: 0,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '生效'
                    },
                    {
                        value: 2,
                        label: '等待'
                    },
                    {
                        value: 3,
                        label: '过期'
                    },
                    {
                        value: 4,
                        label: '失效'
                    }
                ],
                params: {
                    status: 0,
                    activeGame: '',
                    activeModel: '',
                    activityName: '',
                    page: 1
                },
                appList: [],
                reverseAppList: {}
            };
        },
        methods: {
            searchActivity () {
                for (let key in this.params) {
                    if (!this.params[key]) {
                        delete this.params[key];
                    }
                }
                this.$emit('searchActivity', this.params);
            },
            addActivity () {
                this.$router.push('/addActivity');
            },
            resetSearch () {
                this.params = {};
                this.page = 1;
                this.$emit('searchActivity', this.params);
            }
        },
        created () {
            getGamesList().then(response => {
                if (response.status.code === 0) {
                    this.appList = response.data.docs || [];
                    let gameList = {};
                    this.appList.forEach(content => {
                        gameList[content._id] = content.gameName;
                    });
                    this.$store.commit('createGameNameList', gameList);
                }
            }).catch(error => {
                errorHandle(error, this);
            });
        }
    };
</script>

<style scoped>

</style>
