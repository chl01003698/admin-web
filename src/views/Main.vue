<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  src="../images/logo.png" key="max-logo" />
                    <img v-show="shrink" src="../images/logo-min.png" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <lock-screen></lock-screen>
                    <!--<message-tip v-model="mesCount"></message-tip>-->
                    <theme-switch></theme-switch>

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <!--<DropdownItem name="ownSpace">个人中心</DropdownItem>-->
                                    <DropdownItem name="changePassword">修改密码</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page" :style="{height: '100%'}">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <Modal
               :loading="cpLoading"
                v-model="isChangePwd"
                title="修改密码"
                @on-ok="changePwdOK"
                @on-cancel="changePwdCancel"
        >
            <Form ref="changePwd" :model="changePwd" :rules="rulesChangepwd" :label-width="100">
                <FormItem label="旧密码" prop="password">
                    <Input type="password" v-model="changePwd.password"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPassword">
                    <Input type="password" v-model="changePwd.newPassword"></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="reNewPassword">
                    <Input type="password" v-model="changePwd.reNewPassword"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import themeSwitch from './main-components/theme-switch/theme-switch.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import { logout, errorHandle, changePassword } from './games/service';

    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            themeSwitch
        },
        data () {
            return {
                shrink: false,
                userName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                isChangePwd: false,
                cpLoading: true,
                changePwd: {
                    password: '',
                    newPassword: '',
                    reNewPassword: ''
                },
                rulesChangepwd: {
                    password: [
                        {
                            required: true,
                            message: '请输入旧密码'
                        }
                    ],
                    newPassword: [
                        {
                            required: true,
                            message: '请输入新密码'
                        }
                    ],
                    reNewPassword: [
                        {
                             required: true,
                             validator: (rule, value, cb) => {
                                 if (value === '') {
                                     cb(new Error('请确认新密码'))
                                 } else if (value !== this.changePwd.newPassword) {
                                     cb(new Error('两次密码输入不一致'))
                                 } else {
                                     cb()
                                 }
                             }
                        }
                    ]
                }
            };
        },
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            }
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('username');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    logout().then(res => {
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        this.$router.push({
                            name: 'login'
                        });
                        location.reload()
                    }).catch(e => {
                        errorHandle(e, this)
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        this.$router.push({
                            name: 'login'
                        });
                        location.reload()
                    })
                } else if (name === 'changePassword') {
                    this.isChangePwd = true;
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            },
            changePwdOK () {
                this.$refs.changePwd.validate( async valid => {
                    if (valid) {
                        try {
                            let { status } = await changePassword(this.changePwd.password, this.changePwd.newPassword)
                            if (status.code !== 0) {
                                this.failChangePwd();
                                return this.$Message.error(status.message);
                            }
                            this.$Message.success('修改密码成功')
                            this.isChangePwd = false;
                            this.resetChangePwd();
                        } catch (e) {
                            errorHandle(e, this);
                            this.failChangePwd();
                        }
                    } else {
                        this.failChangePwd();
                    }
                })
            },
            failChangePwd () {
                this.cpLoading = false;
                this.$nextTick(() => {
                    this.cpLoading = true;
                })
            },
            changePwdCancel () {
                this.resetChangePwd()
            },
            resetChangePwd () {
                this.$refs.changePwd.resetFields();
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            }
        },
        mounted () {
            this.init();
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        }
    };
</script>
