<template>
    <div>
        <Tree ref="permissionTree" :data="permissions" show-checkbox multiple @on-check-change="addPermissions"></Tree>
        <div class="actions" style="margin-top:15px;">
            <Button type="primary" @click="postData">提交</Button>
            <Button type="warning" @click="reset">重置</Button>
        </div>
    </div>
</template>

<script>
    import { getPermissionsList, getPermissionsByGroup, renderPermissionList, assignPermissions, assignPermissionsByGroup } from '../../service';
    export default {
        name: "assign-permissions",
        data () {
            return {
                groupId: '',
                permissions: [],
                initPermissions: [],
                choicePermissions: [],
                canReset: false,
                symbolChild: {}
            };
        },
        methods: {
            async renderPermissonList () {
                const ret_permissions = await getPermissionsList();
                let hasPermissions = await getPermissionsByGroup(this.groupId);
                let tmpArr = [];
                if (ret_permissions.status.code === 0 && hasPermissions.status.code === 0) {
                    hasPermissions.data.forEach(item => {
                        this.initPermissions.push(item._id);
                    });

                    tmpArr = assignPermissions(_.cloneDeep(ret_permissions.data.docs), this.initPermissions);
                }
                return tmpArr;
            },
            addPermissions (values) {
                let selectedNode = this.$refs.permissionTree.flatState.filter(obj => obj.node.checked);
                this.canReset = true;
                this.choicePermissions = [];
                values.forEach(item => {
                    this.choicePermissions.push(item._id);
                });
                let parentNodes = {};
                selectedNode.forEach(i => {
                    if (this.$refs.permissionTree.flatState[i.parent]) {
                        parentNodes[this.$refs.permissionTree.flatState[i.parent].node._id] = 1;
                    }
                })
                parentNodes = Object.keys(parentNodes);
                this.choicePermissions = _.uniq(this.choicePermissions.concat(parentNodes));
            },
            postData () {
                assignPermissionsByGroup(this.groupId, this.choicePermissions).then(response => {
                    if (response.status.code === 0) {
                        this.canReset = false;
                        this.$Message.success('更新成功');
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            reset () {
                if (this.canReset) {
                    this.renderPermissonList().then(data => {
                        this.permissions = renderPermissionList(data);
                    });
                }
            }
        },
        created () {
            this.groupId = this.$route.params.group_id;
            this.renderPermissonList().then(data => {
                this.permissions = renderPermissionList(data);
            });
        }
    }
</script>

<style scoped>

</style>