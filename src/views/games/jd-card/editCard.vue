<template>
    <div>
        <div class="topAction">
            <Button @click="goBack">返回</Button>
        </div>
        <div class="content">
            <Form ref="card" :model="params" :rules="rules" :label-width="80">
                <FormItem label="卡号" prop="cardNumber">
                    <Input v-model="params.cardNumber"></Input>
                </FormItem>
                <FormItem label="卡密" prop="cardSecret">
                    <Input v-model="params.cardSecret"></Input>
                </FormItem>
                <FormItem label="面额" prop="denomination">
                    <Input v-model="params.denomination"></Input>
                </FormItem>
                <FormItem label="录入时间" prop="createdAt">
                    <Input v-model="params.createdAt" disabled></Input>
                </FormItem>
                <FormItem label="当前状态" prop="checkStatus">
                    {{this.strStatus[initStatus]}} <Checkbox v-model="params.checkStatus" :true-value="1">强制失效</Checkbox>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="postData">提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import { getJDCardById, errorHandle, updateJDCardById } from '../service';
    import moment from 'moment';
    export default {
        name: 'test',
        data() {
            return {
                params: {
                    cardNumber: '',
                    cardSecret: '',
                    denomination: '',
                    createdAt: '',
                    status: 0,
                    checkStatus: 0
                },
                rules: {},
                cardid: '',
                strStatus: ['', '正常', '已发放', '失效'],
                initStatus: 0
            }
        },
        methods: {
            goBack () {
                this.$store.commit('removeTag', 'edit-card');
                this.$router.go(-1);
            },
            async postData () {
                try {
                    let params = JSON.parse(JSON.stringify(this.params));
                    delete params.createdAt;
                    delete params.checkStatus;
                    delete params.sendTarget;
                    delete params.updatedAt;
                    delete params.__v;
                    delete params._id;
                    const {status, data} = await updateJDCardById(this.cardid, params);
                    if (status.code !== 0) {
                        throw(new Error(status.message));
                    }
                    this.$Message.success('更新成功');
                    this.goBack();
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            async cardDetail () {
                try {
                    let {status, data} = await getJDCardById(this.cardid);
                    if (status.code !== 0) {
                        throw(new Error(status.message));
                    }
                    data.createdAt = moment(data.createdAt).format('YYYY-MM-DD HH:mm');
                    this.initStatus = data.status;
                    this.params = data;
                } catch(e) {
                    errorHandle(e, this);
                }
            },
        },
        created () {
            this.cardid = this.$route.params.id;
            if (this.cardid) {
                this.cardDetail();
            }
        },
        watch: {
            'params.checkStatus': function (val) {
                if (val === 1) {
                    this.params.status = 3;
                } else {
                    this.params.status = this.initStatus;
                }
            }
        }
    }
</script>

<style scoped>

</style>