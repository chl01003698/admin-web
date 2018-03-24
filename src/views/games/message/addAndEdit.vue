<template>
    <div>
        <Button @click="goBack">返回</Button>
        <div class="form-content" style="margin-top:20px;">
            <Form :model="formData" :rules="ruleData">
                <FormItem label="标题" prop="title" :label-width="80">
                    <Input v-model="formData.title" placeholder="请输入消息标题"></Input>
                </FormItem>
                <FormItem label="副标题" prop="subtitle" :label-width="80">
                    <Input v-model="formData.subtitle" placeholder="请输入消息副标题"></Input>
                </FormItem>
                <FormItem label="发送目标" prop="to" :label-width="80">
                    <Row>
                        <Col span="2">
                            <Checkbox v-model="formData.type" :true-value="0" :false-value="1">全服</Checkbox>
                        </Col>
                        <Col v-if="formData.type === 1" span="6">
                            <Input v-model="formData.to" placeholder="请输入发送目标"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="内容" prop="content" :label-width="80">
                    <Input type="textarea" v-model="formData.content" placeholder="请输入消息内容"></Input>
                </FormItem>
                <FormItem label="附件商品" prop="items" :label-width="80">
                    <Row>
                        <Col span="2" :style="{textAlign: 'center'}">
                            <Checkbox v-model="formData.items[0].checked" >桌卡</Checkbox>
                        </Col>
                        <Col v-show="formData.items[0].checked" span="6">
                            <Input v-model="formData.items[0].count" number placeholder="请输入桌卡数量"></Input>
                        </Col>
                        <Col span="2" :style="{textAlign: 'center'}">
                            <Checkbox v-model="formData.items[1].checked" >赛卡</Checkbox>
                        </Col>
                        <Col v-show="formData.items[1].checked" span="6">
                            <Input v-model="formData.items[1].count" number placeholder="请输入赛卡数量"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="按钮类型" prop="btnTitle" :label-width="80">
                    <RadioGroup  v-model="formData.btnTitle">
                        <Radio label="无"></Radio>
                        <Radio label="领取"></Radio>
                        <Radio label="前往"></Radio>
                    </RadioGroup >
                </FormItem>
                <FormItem label="定时时间" prop="timing" :label-width="80">
                    <Row>
                        <Col span="2" :style="{textAlign: 'center'}">
                            <Checkbox v-model="formData.timing">定时</Checkbox>
                        </Col>
                        <Col v-show="formData.timing" span="6">
                            <DatePicker type="datetime" placeholder="选择发送时间" v-model="formData.date"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="postData">确认</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import { addMessage, getMessageById, updateMessageById, errorHandle } from '../service';
    import dateformat from 'dateformat';
    export default {
        name: 'add-and-edit',
        data () {
            return {
                _id: undefined,
                formData: {
                    title: '',
                    subtitle: '',
                    to: '5a8fe6ede83d1918d6cd26a7',
                    content: '',
                    items: [
                        {
                            checked: false,
                            type: 1,
                            count: 1,
                            itemId: 'Card'
                        },
                        {
                            checked: false,
                            type: 1,
                            count: 1,
                            itemId: 'Match'
                        }
                    ],
                    fujiawenzi: '',
                    btnTitle: '无',
                    jumptarget: '',
                    timing: false,
                    date: '',
                    type: 0
                },
                ruleData: {
                    title: [{required: true, message: '请输入消息标题', trigger: 'blur'}],
                    subtitle: [{required: true, message: '请输入消息副标题', trigger: 'blur'}],
                    content: [{required: true, message: '请输入消息内容', trigger: 'blur'}]
                }
            };
        },
        methods: {
            goBack () {
                if (this._id) {
                    this.$store.commit('removeTag', 'edit-message');
                } else {
                    this.$store.commit('removeTag', 'add-message');
                }
                this.$router.go(-1);
            },
            postData () {
                let postData = {
                    type: this.formData.type,
                    title: this.formData.title,
                    subtitle: this.formData.subtitle,
                    content: this.formData.content,
                    btnTitle: this.formData.btnTitle,
                    items: [],
                    timing: this.formData.timing
                };
                if (this.formData.type === 1) {
                    if (this.formData.to === '') {
                        return this.$Message.error('请填写发送目标');
                    }
                    postData.to = this.formData.to;
                }
                if (this.formData.items[0].checked) {
                    if (parseInt(this.formData.items[0].count) === 0 || this.formData.items[0].count === '') {
                        return this.$Message.error('请输入正确的桌卡数量');
                    }
                    postData.items.push({
                        type: 1,
                        itemId: 'Card',
                        count: parseInt(this.formData.items[0].count)
                    });
                }
                if (this.formData.items[1].checked) {
                    if (parseInt(this.formData.items[1].count) === 0 || this.formData.items[1].count === '') {
                        return this.$Message.error('请输入正确的赛卡数量');
                    }
                    postData.items.push({
                        type: 1,
                        itemId: 'Match',
                        count: parseInt(this.formData.items[1].count)
                    });
                }
                if (this.formData.timing) {
                    if (!this.formData.date) {
                        return this.$Message.error('请输入发送时间');
                    }
                    postData.date = dateformat(this.formData.date, 'yyyy-mm-dd HH:MM');
                }
                if (this._id) {
                    updateMessageById(this._id, postData).then(response => {
                        if (response.status.code === 0) {
                            this.$Message.success('更新成功');
                            this.goBack();
                        }
                    }).catch(error => {
                        errorHandle(error, this);
                    });
                } else {
                    addMessage(postData).then(data => {
                        if (data.status.code === 0) {
                            this.$Message.success('添加成功');
                            this.goBack();
                        }
                    }).catch(error => {
                        errorHandle(error, this);
                    });
                }
            }
        },
        created () {
            this._id = this.$route.params.id;
            if (this._id) {
                getMessageById(this._id).then(response => {
                    if (response.status.code === 0) {
                        let data = response.data;
                        let tmp = JSON.parse(JSON.stringify(this.formData.items));
                        for (let i = tmp.length; i--;) {
                            for (let j = data.items.length; j--;) {
                                if (tmp[i].itemId === data.items[j].itemId) {
                                    tmp[i] = data.items[j];
                                    tmp[i].checked = true;
                                }
                            }
                        }
                        data.items = tmp;
                        this.formData = data;
                    }
                }).catch(error => {
                    errorHandle(error, this);
                });
            }
        }
    };
</script>

<style scoped>

</style>
