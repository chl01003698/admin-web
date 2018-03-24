<template>
    <div>
        <Tree :data="permissionList"></Tree>
    </div>
</template>

<script>
    import { getPermissionsList, renderPermissionList, errorHandle } from '../../service';

    export default {
        name: 'index',
        data () {
            return {
                permissionList: []
            };
        },
        methods: {
            fetchList () {
                getPermissionsList().then(response => {
                    let data = response.data.docs;
                    this.permissionList = renderPermissionList(data);
                }).catch(error => {
                    errorHandle(error, this);
                });
            }
        },
        created () {
            this.fetchList();

        }
    };
</script>

<style scoped>

</style>