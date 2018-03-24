<template>
    <div>
        <Form ref="cards" :model="cards" :rules="cardRules" :label-width="80">
            <FormItem label="京东卡" prop="jdcardArr">
                <Input v-model="cards.jdcardArr" type="textarea" :rows="10"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="addCard">添加</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import { addJDCard, errorHandle } from '../service';
    export default {
        name: "add-card",
        data() {
            const checkCardText = (rule, value, callback) => {
                let flag = false;
                if (this.formatCardText.length === 0) {
                    callback(new Error('格式不正确'))
                } else {
                    this.formatCardText.forEach(item => {
                        if (!/^\d+$/.test(item[2]) || item.length !== 3) {
                            flag = true;
                        }
                    })
                    if (flag) {
                        callback(new Error('格式不正确'));
                    } else {
                        callback()
                    }
                }
            }
            return {
                cards: {
                    jdcardArr: ''
                },
                cardRules: {
                    jdcardArr: [
                        {
                            validator: checkCardText,
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            addCard () {
                this.$refs.cards.validate(async valid => {
                    try {
                        if (valid) {
                            let {status} = await addJDCard(this.formatCardText);
                            if (status.code !== 0) {
                                throw(new Error(status.message))
                            }
                            this.$Message.success('添加成功');
                            this.cards.jdcardArr = '';
                            this.$refs.cards.resetFields();
                        } else {
                            throw(new Error('格式不正确'))
                        }
                    } catch(e) {
                        errorHandle(e, this);
                    }
                })
            }
        },
        created() {
        },
        computed: {
            formatCardText () {
                let arr = this.cards.jdcardArr.split('\n');
                arr = arr.map(item => {
                    return item.split(',');
                });
                return arr
            }
        }
    }
</script>

<style scoped>

</style>