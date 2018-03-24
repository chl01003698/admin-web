<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    请验证手机
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="mobile">
                            <Input v-model="form.mobile" placeholder="请输入手机号">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="code">
                            <Row>
                                <Col :span="17">
                                    <Input type="text" v-model="form.code" placeholder="请输入验证码"></Input>
                                </Col>
                                <Col :span="6" :push="1">
                                    <Button type="primary" size="small" @click="getCode" :disabled="isDisabled">获取验证码</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { getCode, verifyMobile, errorHandle } from './games/service'
export default {
    data () {
        return {
            form: {
                mobile: '',
                code: ''
            },
            rules: {
                mobile: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            },
            isDisabled: false
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate( async (valid) => {
                if (valid) {
                    try {
                        let { status, data } = await verifyMobile({mobile: this.form.mobile, code: this.form.code})
                        if (status.code !== 0) {
                            return this.$Message.error(status.message);
                        }
                        Cookies.set('permissions', data.permissions);
                        Cookies.set('needVerifyMobile', false);
                        this.$router.replace('/home');
                    } catch (e) {
                        errorHandle(e);
                    }
                }
            });
        },
        async getCode (e) {
            if (this.form.mobile === '') {
                return this.$Message.error('请输入手机号');
            }
            try {
                let { status } = await getCode(this.form.mobile)
                if (status.code === 0) {
                    let count = 60
                    this.isDisabled = true;
                    e.target.innerText = count + '秒';
                    let timer = setInterval(() => {
                        e.target.innerText = count + '秒';
                        count--
                        if (count <= 0) {
                            clearInterval(timer);
                            this.isDisabled = false;
                            e.target.innerText = '获取验证码';
                        }
                    }, 1000)
                }
            } catch (error) {
                errorHandle(error)
            }
        }
    },
    created () {}
};
</script>

<style>

</style>
