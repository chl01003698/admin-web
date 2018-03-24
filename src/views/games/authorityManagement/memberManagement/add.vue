<template>
    <div>
        <div class="topAction">
            <Button>返回</Button>
        </div>
        <div class="container" style="margin-top:15px;">
            <Form ref="addUserForm" :model="user" :rules="ruleUser" :label-width="100">
                <FormItem label="用户组" prop="group">
                    <RadioGroup v-model="user.group">
                        <Radio label="0">超级管理员</Radio>
                        <Radio v-for="item in userGroups" :label="item._id" :key="item._id">{{item.groupName}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="账号" prop="username">
                    <Input v-model="user.username" placeholder="请输入用户账号"></Input>
                </FormItem>
                <FormItem label="昵称" prop="nickname">
                    <Input v-model="user.nickname" placeholder="请输入用户昵称"></Input>
                </FormItem>
                <FormItem label="手机号" prop="mobile">
                    <Input v-model="user.mobile" placeholder="请输入用户手机"></Input>
                </FormItem>
                <FormItem label="初始密码" prop="password">
                    <Input v-model="user.password" placeholder="请输入初始密码"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input v-model="user.email" placeholder="请输入用户邮箱"></Input>
                </FormItem>
                <FormItem label="状态" prop="status">
                    <RadioGroup v-model="user.status">
                        <Radio label="0">正常</Radio>
                        <Radio label="1">冻结</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit()">确定</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import { addUser, errorHandle, getAllUserGroup, getUserDetailById, updateUserDetailById } from '../../service'
    export default {
        name: 'add',
        data () {
            return {
                isEdit: false,
                user: {
                    username: '',
                    password: '',
                    nickname: '',
                    email: '',
                    group: '',
                    mobile: '',
                    status: 0
                },
                ruleUser: {
                    username: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '请输入用户账号'
                        }
                    ],
                    nickname: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '请输入用户昵称'
                        }
                    ],
                    email: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '请输入用户邮箱'
                        }
                    ],
                    group: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '请选择用户所属组'
                        }
                    ],
                    password: [
                        {
                            min: 6,
                            max: 18,
                            message: '请输入6-18位字母、数字或下划线'
                        }
                    ]
                },
                userGroups: [],
                userId: ''
            }
        },
        methods: {
            goBack () {
                this.userId ? this.$store.commit('removeTag', 'edit-user') : this.$store.commit('removeTag', 'add-user');
                this.$router.go(-1);
            },
            handleSubmit () {
                this.$refs.addUserForm.validate(async valid => {
                    if (valid) {
                        try {
                            if (this.userId) {
                                this.updateUserDetail();
                            } else {
                                let {status} = await addUser(this.user);
                                if (status.code !== 0) {
                                    return this.$Message.error(status.message);
                                }
                                this.$Message.success('添加成功');
                                this.goBack();
                            }
                        } catch(e) {
                            errorHandle(e, this)
                        }
                    }
                });
            },
            async getAllUserGroup () {
                try {
                    let {status, data} = await getAllUserGroup();
                    if (status.code !== 0) {
                        return this.$Message.error(status.message);
                    }
                    this.userGroups = data.docs;
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            async getUserDetail () {
                try {
                    let {status, data} = await getUserDetailById(this.userId)
                    if (status.code !== 0) {
                        return this.$Message.error(status.message);
                    }
                    for (let k in data) {
                        this.user[k] = data[k];
                    }
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            async updateUserDetail () {
                try {
                    let params = {
                        group: this.user.group,
                        nickname: this.user.nickname,
                        mobile: this.user.mobile,
                        email: this.user.email,
                        status: this.user.status
                    }
                    if (this.user.password) {
                        params.password = this.user.password;
                    }
                    let {status} = await updateUserDetailById(this.userId, params);
                    if (status.code !== 0) {
                        return this.$Message.error(status.message);
                    }
                    this.$Message.success('更新成功');
                    this.goBack();
                } catch(e) {
                    errorHandle(e, this);
                }
            }
        },
        created () {
            this.userId = this.$route.params.user_id;
            if (this.userId) {
                this.getUserDetail()
            }
            this.getAllUserGroup();
        }
    }
</script>

<style scoped>

</style>