<template>
    <div>
        <div class="topAction">
            <Button @click="goBack">返回</Button>
        </div>
        <div class="form" style="margin-top:15px;">
            <Form :model="decoration" :rules="validateRules" :label-width="80">
                <FormItem label="描述" prop="decorationType">
                    <Select v-model="decoration.decorationType">
                        <Option value="tablet">牌匾</Option>
                        <Option value="background">背景</Option>
                    </Select>
                </FormItem>
                <FormItem label="图片" prop="decorationImg">
                    <Upload
                            :action="uploadDomain"
                            :format="['jpg', 'jpeg', 'png']"
                            :on-success="success"
                            :show-upload-list="false"
                            :on-progress="uploading"
                            accept="image/*"
                            :on-format-error="formatError"
                    >
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <div v-if="uploadProgress">
                        <Progress :percent="uploadProgress">
                            <Icon type="checkmark-circled"></Icon>
                            <span>{{uploadProgress + '%'}}</span>
                        </Progress>
                    </div>
                    <div v-if="decoration.decorationImg" style="margin-top:15px;">
                        <img :src="verbUploadImg" alt="">
                    </div>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submitPost">提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import { uploadDomain, getImgFromOSS, errorHandle, addDecoration } from '../service'
    export default {
        name: 'edit',
        data () {
            return {
                decoration: {
                    decorationType: 'tablet',
                    decorationImg: ''
                },
                validateRules: {
                    decorationType: [
                        {
                            required: true,
                            message: '请选择装修类型'
                        }
                    ]
                },
                uploadDomain: uploadDomain,
                uploadProgress: 0,
                planId: ''
            }
        },
        methods: {
            success (res) {
                if (res.status.code !== 0) {
                    return this.$Message.error(res.status.message);
                }
                this.decoration.decorationImg = res.data.url;
            },
            uploading (e) {
                this.uploadProgress = e.percent;
            },
            async submitPost () {
                try {
                    if (this.decoration.decorationImg === '') {
                        throw(new Error('请上传装修图片'));
                    }
                    let {status} = await addDecoration(this.decoration);
                    if (status.code !== 0) {
                        throw(new Error(status.message));
                    }
                    this.$Message.success('添加成功');
                    this.goBack();
                } catch(e) {
                    errorHandle(e, this);
                }
            },
            goBack () {
                this.planId ? this.$store.commit('removeTag', 'edit-plan') : this.$store.commit('removeTag', 'add-plan')
                this.$router.go(-1);
            },
            formatError () {
                this.$Message.error('文件格式不正确')
            }
        },
        created () {},
        computed: {
            verbUploadImg () {
                return getImgFromOSS(this.decoration.decorationImg);
            }
        }
    };
</script>

<style scoped>

</style>