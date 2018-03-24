import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const verifyMobile = {
    path: '/verify-mobile',
    name: 'verify-mobile',
    meta: {
        title: '手机验证'
    },
    component: () => import('@/views/verifyMobile.vue')
}

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        // { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue') }, // 用于展示动态路由
        // { path: 'shopping', title: '购物详情', name: 'shopping', component: () => import('@/views/advanced-router/component/shopping-info.vue') }, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },
        { path: 'addActivity', title: '添加活动', name: 'add-activity',meta: {title: '添加活动'}, component: () => import('@/views/games/activityManager/add.vue') },
        { path: 'editActivity/:id', title: '编辑活动', name: 'edit-activity',meta: {title: '编辑活动'}, component: () => import('@/views/games/activityManager/add.vue'), meta: {isEdit: true} },
        { path: 'addMessage', title: '添加消息', name: 'add-message',meta: {title: '添加消息'}, component: () => import('@/views/games/message/addAndEdit.vue') },
        { path: 'editMessage/:id', title: '编辑消息', name: 'edit-message',meta: {title: '编辑消息'}, component: () => import('@/views/games/message/addAndEdit.vue') },
        { path: 'assign-permission/:group_id', title: '分配权限', name: 'assign-permission',meta: {title: '分配权限'}, component: () => import('@/views/games/authorityManagement/userGroup/assignPermissions.vue') },
        { path: 'assign-member/:group_id', title: '分配成员', name: 'assign-member',meta: {title: '分配成员'}, component: () => import('@/views/games/authorityManagement/userGroup/assignMembers.vue') },
        { path: 'add-user', title: '添加成员', name: 'add-user',meta: {title: '添加账号'}, component: () => import('@/views/games/authorityManagement/memberManagement/add.vue') },
        { path: 'edit-user/:user_id', title: '编辑成员', name: 'edit-user',meta: {title: '编辑账号'}, component: () => import('@/views/games/authorityManagement/memberManagement/add.vue') },
        { path: 'player-detail/:user_id', title: '玩家详情', name: 'player-detail',meta: {title: '玩家详情'}, component: () => import('@/views/games/players/detail.vue') },
        { path: 'add-plan', title: '添加方案', name: 'add-plan',meta: {title: '添加装修方案'}, component: () => import('@/views/games/decorationManagement/edit.vue') },
        { path: 'edit-plan/:id', title: '编辑方案', name: 'edit-plan',meta: {title: '编辑装修方案'}, component: () => import('@/views/games/decorationManagement/edit.vue') },
        { path: 'add-broadcast', title: '添加广播', name: 'add-broadcast',meta: {title: '添加广播'}, component: () => import('@/views/games/broadcastManagement/edit.vue') },
        { path: 'edit-broadcast/:id', title: '编辑广播', name: 'edit-broadcast',meta: {title: '编辑广播'}, component: () => import('@/views/games/broadcastManagement/edit.vue') },
        { path: 'add-card', title: '添加京东卡', name: 'add-card',meta: {title: '添加京东卡'}, component: () => import('@/views/games/jd-card/addCard.vue') },
        { path: 'edit-card/:id', title: '编辑京东卡', name: 'edit-card',meta: {title: '编辑京东卡'}, component: () => import('@/views/games/jd-card/editCard.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/games',
        icon: 'key',
        name: 'games',
        title: '游戏管理',
        component: Main,
        children: [
            { path: 'params', title: '参数列表', name: 'params',meta: {title: '参数列表'}, component: () => import('@/views/games/parameterList/parameterList.vue') },
            { path: 'activity', title: '活动管理', name: 'activity',meta: {title: '活动管理'}, component: () => import('@/views/games/activityManager/activityManager.vue') },
            { path: 'badge', title: '角标管理', name: 'badgeMange',meta: {title: '角标管理'}, component: () => import('@/views/games/badgeManage/index.vue') },
            { path: 'message', title: '消息管理', name: 'message',meta: {title: '消息管理'}, component: () => import('@/views/games/message') },
            { path: 'decoration', title: '装修管理', name: 'decoration',meta: {title: '装修管理'}, component: () => import('@/views/games/decorationManagement') },
            { path: 'game-list', title: '游戏列表', meta: {title: '游戏列表'}, name: 'game-list', component: () => import('@/views/games/gameList.vue') },
            { path: 'players', title: '玩家列表', name: 'players',meta: {title: '玩家列表'}, component: () => import('@/views/games/players') },
            { path: 'broadcast', title: '广播管理', name: 'broadcast',meta: {title: '广播管理'}, component: () => import('@/views/games/broadcastManagement') },
            { path: 'jd-card', title: '京东卡管理', name: 'jdcard',meta: {title: '京东卡管理'}, component: () => import('@/views/games/jd-card/index.vue') }
        ]
    },
    {
        path: '/permissions',
        icon: 'key',
        name: 'permissions',
        title: '权限管理',
        component: Main,
        children: [
            {
                path: 'user-group',
                title: '用户组管理',
                name: 'user-group',
                meta: {title: '用户组管理'},
                component: () => import('@/views/games/authorityManagement/userGroup')
            },
            {
                path: 'permissions-list',
                title: '权限列表',
                name: 'permissions-list',
                meta: {title: '权限列表'},
                component: () => import('@/views/games/authorityManagement/permissionsList')
            },
            {
                path: 'member-management',
                title: '管理员管理',
                name: 'member-management',
                meta: {title: '管理员管理'},
                component: () => import('@/views/games/authorityManagement/memberManagement')
            }
        ]
    }
    // {
    //     path: '/access',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue') }
    //     ]
    // },
    // {
    //     path: '/international',
    //     icon: 'earth',
    //     title: {i18n: 'international'},
    //     name: 'international',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
    //     ]
    // },
    // {
    //     path: '/component',
    //     icon: 'social-buffer',
    //     name: 'component',
    //     title: '组件',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'text-editor',
    //             icon: 'compose',
    //             name: 'text-editor',
    //             title: '富文本编辑器',
    //             component: () => import('@/views/my-components/text-editor/text-editor.vue')
    //         },
    //         {
    //             path: 'md-editor',
    //             icon: 'pound',
    //             name: 'md-editor',
    //             title: 'Markdown编辑器',
    //             component: () => import('@/views/my-components/markdown-editor/markdown-editor.vue')
    //         },
    //         {
    //             path: 'image-editor',
    //             icon: 'crop',
    //             name: 'image-editor',
    //             title: '图片预览编辑',
    //             component: () => import('@/views/my-components/image-editor/image-editor.vue')
    //         },
    //         {
    //             path: 'draggable-list',
    //             icon: 'arrow-move',
    //             name: 'draggable-list',
    //             title: '可拖拽列表',
    //             component: () => import('@/views/my-components/draggable-list/draggable-list.vue')
    //         },
    //         {
    //             path: 'area-linkage',
    //             icon: 'ios-more',
    //             name: 'area-linkage',
    //             title: '城市级联',
    //             component: () => import('@/views/my-components/area-linkage/area-linkage.vue')
    //         },
    //         {
    //             path: 'file-upload',
    //             icon: 'android-upload',
    //             name: 'file-upload',
    //             title: '文件上传',
    //             component: () => import('@/views/my-components/file-upload/file-upload.vue')
    //         },
    //         {
    //             path: 'count-to',
    //             icon: 'arrow-graph-up-right',
    //             name: 'count-to',
    //             title: '数字渐变',
    //             // component: () => import('@/views/my-components/count-to/count-to.vue')
    //             component: () => import('@/views/my-components/count-to/count-to.vue')
    //         },
    //         {
    //             path: 'split-pane-page',
    //             icon: 'ios-pause',
    //             name: 'split-pane-page',
    //             title: 'split-pane',
    //             component: () => import('@/views/my-components/split-pane/split-pane-page.vue')
    //         }
    //     ]
    // },
    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: () => import('@/views/form/article-publish/article-publish.vue') },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: () => import('@/views/form/work-flow/work-flow.vue') }
    //
    //     ]
    // },
    // // {
    // //     path: '/charts',
    // //     icon: 'ios-analytics',
    // //     name: 'charts',
    // //     title: '图表',
    // //     component: Main,
    // //     children: [
    // //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
    // //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }
    //
    // //     ]
    // // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: () => import('@/views/tables/dragable-table.vue') },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: () => import('@/views/tables/editable-table.vue') },
    //         { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: () => import('@/views/tables/searchable-table.vue') },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: () => import('@/views/tables/exportable-table.vue') },
    //         { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: () => import('@/views/tables/table-to-image.vue') }
    //     ]
    // },
    // {
    //     path: '/advanced-router',
    //     icon: 'ios-infinite',
    //     name: 'advanced-router',
    //     title: '高级路由',
    //     component: Main,
    //     children: [
    //         { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: () => import('@/views/advanced-router/mutative-router.vue') },
    //         { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: () => import('@/views/advanced-router/argument-page.vue') }
    //     ]
    // },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue') }
    //     ]
    // }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    verifyMobile,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];