<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="captcha">
                            <Input type="text" v-model="form.captcha" placeholder="请输入验证码"></Input>
                            <!---->
                        </FormItem>
                        <div v-html="captchaData && captchaData.data" @click="getCaptcha" style="margin-bottom:10px;text-align:center;"></div>
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
import { getCaptcha, login, saveUserAction, errorHandle } from './games/service'
export default {
    data () {
        return {
            form: {
                username: '',
                password: '',
                captcha: ''
            },
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            },
            captchaData: {}
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate( async (valid) => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.form));
                    params.captchaId = this.captchaData.id;
                    try {
                        var {status, data} = await login(params);

                        if (status.code !== 0) {
                            return this.$Message.error(status.message)
                        }

                        Cookies.set('username', data.username)
                        Cookies.set('needVerifyMobile', data.needVerifyMobile)
                        if (data.needVerifyMobile) {
                            this.$router.replace('/verify-mobile')
                        } else {
                            Cookies.set('permissions', data.permissions);
                            this.$router.replace('/home')
                        }
                    } catch (e) {
                        errorHandle(e, this)
                    }

                    // login(params).then((response) => {
                    //     console.log(response, 1111)
                    // }).catch(error => {
                    //     if (error.response) {
                    //         this.$Message.error(error.response.data.status.message)
                    //     }
                    // })
                    // Cookies.set('user', this.form.userName);
                    // Cookies.set('password', this.form.password);
                    // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                    // if (this.form.userName === 'iview_admin') {
                    //     Cookies.set('access', 0);
                    // } else {
                    //     Cookies.set('access', 1);
                    // }
                    // this.$router.push({
                    //     name: 'home_index'
                    // });
                }
            });
        },
        getCaptcha () {
            getCaptcha().then(response => {
                this.captchaData = response;
                this.captchaData.data = decodeURIComponent(this.captchaData.data);
            }).catch(error => {
                errorHandle(error)
            })
        }
    },
    created () {
        this.getCaptcha()
    }
};
</script>

<style>

</style>
