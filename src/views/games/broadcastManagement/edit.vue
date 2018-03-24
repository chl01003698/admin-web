<template>
    <div>
        <div class="topa">
            <Button @click="goBack">返回</Button>
        </div>
        <div class="content" style="margin-top:15px;">
            <Form ref="broadcast" :label-width="80" :model="params" :rules="rules">
                <FormItem label="描述" prop="broadcastName">
                    <Input v-model="params.broadcastName" placeholder="请输入描述"></Input>
                </FormItem>
                <FormItem label="内容" prop="content">
                    <Input type="textarea" v-model="params.content" placeholder="请输入内容"></Input>
                </FormItem>
                <FormItem label="生效app" prop="activeGame">
                    <Select v-model="params.activeGame">
                        <Option v-for="item in games" :key="item._id" :value="item._id">{{item.gameName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="生效模式" prop="activeModel">
                    <Select v-model="params.activeModel">
                        <Option :value="1">积分赛</Option>
                        <Option :value="2">朋友局</Option>
                    </Select>
                </FormItem>
                <FormItem label="生效时间" prop="choiceDate">
                    <DatePicker v-model="params.choiceDate" :value="params.choiceDate" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择生效时间" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="postData">提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import { getGamesList, addBroadcast, errorHandle, getBroadcastById, updateBroadcastById } from '../service';
    import moment from 'moment';
    import _ from 'lodash';
    export default {
        name: 'edit',
        data () {
            const checkChoiceDate = (rule, value, callback) => {
                if(!value[0] || !value[1]) {
                    callback(new Error('请选择生效时间'));
                } else {
                    callback();
                }
            }
            return {
                params: {
                    broadcastName: '',
                    content: '',
                    activeGame: '',
                    activeModel: '',
                    startAt: '',
                    endAt: '',
                    choiceDate: [],
                    type: 1
                },
                rules: {
                    broadcastName: [
                        {
                            required: true,
                            message: '请输入广播描述'
                        }
                    ],
                    content: [
                        {
                            required: true,
                            message: '请输入广播内容'
                        }
                    ],
                    activeGame: [
                        {
                            required: true,
                            message: '请选择生效app'
                        }
                    ],
                    activeModel: [
                        {
                            required: true,
                            message: '请选择生效模式'
                        }
                    ],
                    choiceDate: [
                        {
                            validator: checkChoiceDate,
                            required: true
                        }
                    ]
                },
                games: [],
                broadcastId: ''
            }
        },
        methods: {
            async getGames () {
                try {
                    const {status, data} = await getGamesList();
                    if (status.code !== 0) throw(new Error(status.message));
                    this.games = data.docs;
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            postData () {
                this.$refs.broadcast.validate(async valid => {
                    if (valid) {
                        try {
                            let params = JSON.parse(JSON.stringify(this.params));
                            delete params.choiceDate;
                            if (this.broadcastId) {
                                const {status} = await updateBroadcastById(this.broadcastId, params);
                                if (status.code !== 0) {
                                    throw(new Error(status.message));
                                }
                                this.$Message.success('编辑成功');
                                this.goBack();
                            } else {
                                const {status} = await addBroadcast(params)
                                if (status.code !== 0) {
                                    throw(new Error(status.message));
                                }
                                this.$Message.success('添加成功');
                                this.goBack();
                            }
                        } catch(e) {
                            errorHandle(e, this);
                        }
                    }
                })
            },
            goBack () {
                this.broadcast === '' ? this.$store.commit('removeTag', 'edit-broadcast') : this.$store.commit('removeTag', 'add-broadcast');
                this.$router.go(-1);
            },
            async getBroadcastDetail () {
                try {
                    let {status, data} = await getBroadcastById(this.broadcastId);
                    if (status.code !== 0) {
                        throw(new Error(status.message))
                    }
                    this.params = _.assignIn(this.params, data);
                    this.$set(this.params.choiceDate, 0, this.params.startAt)
                    this.$set(this.params.choiceDate, 1, this.params.endAt)
                } catch(e) {
                    errorHandle(e, this);
                }
            }
        },
        created (){
            this.broadcastId = this.$route.params.id;
            if (this.broadcastId) {
                this.getBroadcastDetail();
            }
            this.getGames();
        },
        watch: {
            'params.choiceDate': function (val) {
                if (val[0] && val[1]) {
                    this.params.startAt = moment(val[0]).format('YYYY-MM-DD hh:mm')
                    this.params.endAt = moment(val[1]).format('YYYY-MM-DD hh:mm')
                }
            }
        }
    };
</script>

<style scoped>

</style>