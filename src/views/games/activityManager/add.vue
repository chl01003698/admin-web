<template>
    <div class="add-activity">
        <Button @click.native="goBack">返回</Button>
        <Form ref="formValidate" :model="activityInfo" :rules="ruleValidate" :label-width="80" :style="{marginTop: '20px'}">
            <FormItem label="名称" prop="activityName">
                <Input v-model="activityInfo.activityName" />
            </FormItem>
            <FormItem label="描述" prop="activityDescription">
                <Input type="textarea" v-model="activityInfo.activityDescription" />
            </FormItem>
            <FormItem label="图片" prop="activityImg">
                <template  v-if="!isEdit">
                    <div v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="uploadImageUrl" width="300" alt="">
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <div v-if="uploadList.length">
                        <div v-for="item in uploadList">
                            <template v-if="item.status === 'finished'">
                                <img :src="uploadImageUrl" width="300" alt="">
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                    </div>
                    <div v-else>
                        <img :src="uploadImageUrl" width="300" alt="">
                    </div>
                </template>
                <Upload
                        ref="upload"
                        :action="uploadDomain"
                        :show-upload-list="false"
                        :on-success="uploadSuccess"
                        :before-upload="beforeUpload"
                        accept="image/*"
                        :format="['jpg', 'png', 'gif']"
                        :on-format-error="formatError"
                >
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传活动图片</Button>
                </Upload>
            </FormItem>
            <FormItem label="生效APP" prop="activeGame">
                <Select v-model="activityInfo.activeGame">
                    <Option v-for="item in gamesList" :key="item._id" :value="item._id">{{item.gameName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="生效模式" prop="activeModel">
                <Select v-model="activityInfo.activeModel" :clearable="true">
                    <Option :value="1">积分赛</Option>
                    <Option :value="2">好友局</Option>
                </Select>
            </FormItem>
            <FormItem label="跳转链接" prop="jumpLink">
                <Input type="text" v-model="activityInfo.jumpLink" />
            </FormItem>
            <FormItem label="角标" prop="subscript">
                <Select v-model="activityInfo.subscript">
                    <Option v-for="item in badgeList" :key="item._id" :value="item._id">{{item.subscriptName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="开始时间" prop="startAt">
                <DatePicker
                        v-model="activityInfo.startAt"
                        type="datetime"
                        placeholder="请选择开始时间"
                        format="yyyy-MM-dd HH:mm"
                        placement="top"
                        style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="endAt">
                <DatePicker
                        v-model="activityInfo.endAt"
                        type="datetime"
                        placeholder="请选择结束时间"
                        format="yyyy-MM-dd HH:mm"
                        placement="top"
                        style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" @click.native="postActivity">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import { getGamesList, getImgFromOSS, addActivity, getActivityById, updateActivityById, getAllBadgeList, uploadDomain, errorHandle } from '../service';
    import dateformat from 'dateformat';

    export default {
        name: 'add',
        data () {
            return {
                activityInfo: {
                    activityName: '',
                    activityDescription: '',
                    activityImg: '',
                    activeGame: '',
                    activeModel: '',
                    jumpLink: '',
                    subscript: '',
                    startAt: '',
                    endAt: ''
                },
                ruleValidate: {
                    activityName: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ],
                    activityDescription: [
                        {
                            required: true,
                            message: '请输入活动描述',
                            trigger: 'blur'
                        }
                    ],
                    activityImg: [
                        {
                            required: true,
                            message: '请上传图片',
                            trigger: 'blur'
                        }
                    ],
                    activeGame: [
                        {
                            required: true,
                            message: '请选择生效APP',
                            trigger: 'blur'
                        }
                    ],
                    startAt: [
                        {
                            required: true,
                            message: '请选择开始时间',
                            trigger: 'blur'
                        }
                    ],
                    endAt: [
                        {
                            required: true,
                            message: '请选择开始时间',
                            trigger: 'blur'
                        }
                    ]
                },
                gamesList: [],
                uploadList: [],
                badgeList: [],
                uploadImageUrl: '',
                isEdit: false,
                detailId: '',
                uploadDomain: uploadDomain
            };
        },
        methods: {
            goBack () {
                if (this.isEdit) {
                    this.$store.commit('removeTag', 'edit-activity');
                } else {
                    this.$store.commit('removeTag', 'add-activity');
                }
                this.$router.go(-1);
            },
            uploadSuccess (res, file) {
                if (res.status.code === 0) {
                    this.activityInfo.activityImg = res.data.url;
                    this.uploadImageUrl = getImgFromOSS(res.data.url);
                }
            },
            beforeUpload () {
                this.$refs.upload.fileList.splice(0, 1);
            },
            postActivity () {
                if (this.isEdit) {
                    updateActivityById(this.detailId, this.activityInfo).then(response => {
                        if (response.status.code === 0) {
                            this.$Message.success('修改成功');
                            this.goBack();
                        }
                    }).catch(error => {
                        errorHandle(error, this);
                    });
                    return false;
                }
                this.activityInfo.startAt = dateformat(this.activityInfo.startAt, 'yyyy-mm-dd HH:MM');
                this.activityInfo.endAt = dateformat(this.activityInfo.endAt, 'yyyy-mm-dd HH:MM');
                addActivity(this.activityInfo).then(response => {
                    if (response.status.code !== 0) {
                        return this.$Message.error(response.status.message);
                    }
                    this.$Message.success('添加成功');
                    this.goBack();
                }).catch(error => {
                    errorHandle(error, this);
                });
            },
            fetchBadgeList () {
                getAllBadgeList().then(response => {
                    if (response.status.code === 0) {
                        this.badgeList = response.data.docs;
                    }
                }).catch(error => {
                    errorHandle(error, this);
                });
            },
            formatError () {
                this.$Message.error('文件格式不正确')
            }
        },
        created () {
            let detailId = this.$route.params.id;
            if (detailId) {
                this.detailId = detailId;
                this.isEdit = true;
                getActivityById(detailId).then(response => {
                    if (response.status.code === 0) {
                        this.activityInfo = response.data;
                        this.uploadImageUrl = getImgFromOSS(this.activityInfo.activityImg);
                    }
                }).catch(error => {
                    errorHandle(error, this);
                });
            }
            getGamesList().then(response => {
                if (response.status.code === 0) {
                    this.gamesList = response.data.docs || [];
                }
            });
            this.fetchBadgeList();
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
    };
</script>

<style scoped>

</style>
