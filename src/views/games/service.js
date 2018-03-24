import * as request from '@/libs/ajax';
import env from '../../../build/env';
import _ from 'lodash';

const domain = env === 'development'
    ? 'http://127.0.0.1:7001'
    : env === 'production'
        ? 'http://192.168.221.38:7000'
        : 'http://127.0.0.1:7001';

// export const uploadDomain = domain + '/api/v1/image';
export const uploadDomain = '/api/v1/image';

// 错误信息
export const errorHandle = function (e, app) {
    let message = '';
    if (e.response) {
        message = e.response.data.status.message;
    } else if (e.request) {
        message = e.request;
        console.log(e.request);
    } else {
        message = e.message;
    }
    app.$Message.error(message)
}

// 添加参数
export const paramterList = function () {
    return request.get('/api/v1/parameters');
}
// 编辑参数
export const editParamter = function (id, data) {
    return request.put('/api/v1/parameters/' + id, data);
}

// 活动管理
export const arrActiveModel = ['', '积分赛', '好友局'];
export const arrActionStatus = ['', '生效', '等待', '过期', '失效'];

// 添加活动
export const addActivity = function (data) {
    return request.post('/api/v1/activities', data);
}
// 活动列表
export const activityList = function (params) {
    let strParams = '';
    for (let key in params) {
        strParams += '&' + key + '=' + params[key];
    }
    return request.get('/api/v1/activities?size=10' + strParams);
}
// 活动条目上下移动
export const moveItemUpOrDown = function (currentId, udId) {
    return request.post('/api/v1/activities/swap/' + currentId + '/' + udId);
}
// 获取活动项目列表
export const getActivityItemByPage = function (page) {
    return request.get('/api/v1/activities?size=10&page=' + page);
}
// 删除活动
export const delActivityById = function (id) {
    return request.del('/api/v1/activities/' + id);
}
// 获取活动
export const getActivityById = function (id) {
    return request.get('/api/v1/activities/' + id);
}
// 更新活动
export const updateActivityById = function (id, params) {
    return request.put('/api/v1/activities/' + id, params);
}

/*
* 角标系列操作
* */
// 添加角标
export const addSubscript = function (params) {
    return request.post('/api/v1/subscripts', params);
}

// 获取角标列表
export const getSubscriptList = function (page = 1) {
    return request.get('/api/v1/subscripts?size=10&sort=updateAt&order=desc&' + 'page=' + page);
}

// 删除指定ID的角标
export const deleteSubscriptById = function (id) {
    return request.del('/api/v1/subscripts/' + id);
}

// 更新指定ID的角标
export const updateSubscriptById = function (id, params) {
    return request.put(' /api/v1/subscripts/' + id, params);
}

// 获取所有角标
export const getAllBadgeList = function () {
    return request.get('/api/v1/subscripts');
}

// 获取所有游戏List
export const getGamesList = function () {
    return request.get('/api/v1/games');
}

// 获取OSS图片
export const getImgFromOSS = function (origin) {
    return domain + '/api/v1/image?imgUrl=' + encodeURI(origin);
}

/*
* 消息管理
* */
// 新增消息
export const addMessage = function (params) {
    return request.post('/api/v1/messages', params);
}
// 获取消息列表
export const getMessageList = function (page = 1, email, target) {
    let str = '&page=' + page;
    if (email) {
        str += '&title=' + email;
    }
    if (target) {
        str += '&to=' + target;
    }
    return request.get('/api/v1/messages?size=10&sort=createdAt&order=desc' + str);
}
// 获取制定ID消息
export const getMessageById = function (id) {
    return request.get('/api/v1/messages/' + id);
}
// 更新指定ID消息
export const updateMessageById = function (id, params) {
    return request.put('/api/v1/messages/' + id, params);
}
// 删除指定ID消息
export const deleteMessageById = function (id) {
    return request.del('');
}

/*
* 用户组管理
* */
// 新增用户组
export const addUserGroup = function (params) {
    return request.post('/api/v1/groups', params);
}
// 获取用户组列表
export const getUserGroupList = function (page = 1) {
    return request.get('/api/v1/groups?size=10&page=' + page);
}
// 获取指定ID的用户组
export const getUserGroupById = function (id) {
    return request.get('/api/v1/groups/' + id);
}
// 更新指定ID用户组
export const updateUserGroupById = function (id, params) {
    return request.put('/api/v1/groups/' + id, params);
}
// 删除指定ID用户组
export const deleteUserGroupById = function (id) {
    return request.del('/api/v1/groups/' + id);
}

/*
* 权限管理
* */
// 获取权限列表
export const getPermissionsList = function () {
    return request.get('/api/v1/permissions');
}

// 获取指定用户组的所有权限
export const getPermissionsByGroup = function (groupId) {
    return request.get('/api/v1/groups/' + groupId + '/permissions');
}

// 为指定id用户组分配权限
export const assignPermissionsByGroup = function (group_id, permissions) {
    return request.post('/api/v1/groups/' + group_id + '/permissions', {permissions});
}
// 获取用户列表
export const getUserList = async function (params) {
    let strParams = '';
    if (!params.page) {
        params.page = 1;
    }
    for (let k in params) {
        if (params[k] !== '') {
            strParams += '&' + k + '=' + params[k];
        }
    }
    return await request.get('/api/v1/users?size=10' + strParams)
}
// 添加用户
export const addUser = async function (params) {
    return await request.post('/api/v1/users', params);
}
// 获取用户组列表
export const getAllUserGroup = async function () {
    return await request.get('/api/v1/groups?size=100');
}
// 通过id获取用户信息
export const getUserDetailById = async function (id) {
    return await request.get('/api/v1/users/' + id);
}
// 通过ID更新用户信息
export const updateUserDetailById = async function (id, params) {
    return await request.put('/api/v1/users/' + id, params);
}
// 获取指定ID用户组成员列表
export const getGroupUsers = async function(id) {
    return await request.get('/api/v1/groups/' + id + '/users')
}
// 从用户组移除用户
export const removeUserFromGroup = async function (group_id, user_id) {
    return await request.del('/api/v1/groups/' + group_id + '/' +user_id)
}
// 添加用户至指定用户组
export const addUserToGroup = async function (group_id, user_id) {
    return await request.post('/api/v1/groups/' + group_id + '/' + user_id);
}

export const assignPermissions = function (permissions, hasPermission) {
    let _permissions = _.cloneDeep(permissions);
    _permissions.forEach(item => {
        item.checked = false;
        item.expand = true;
        item.title = item.descresption;
        if (_.indexOf(hasPermission, item._id) !== -1 && item.level !== 1) {
            item.checked = true;
        }
    });
    return _permissions;
}

export const renderPermissionList = function (arr) {
    let ret_arr = arr;
    ret_arr.forEach(item => {
        item.title = item.descresption;
        item.expand = true;
    });
    let permission = _.groupBy(ret_arr, 'level');
    let parent = permission['1'];
    let childrens = permission['2'];
    childrens.forEach(item => {
        let childrensParent = item.permissionFlag.substr(0, 3);
        for (let i = 0; i < parent.length; i++) {
            if (childrensParent === parent[i]['permissionFlag']) {
                if (parent[i].children === undefined || parent[i].children.constructor !== Array) {
                    parent[i].children = [];
                }
                parent[i].children.push(item);
            }
        }
    });
    return parent;
}

/*
* 登陆相关
* */
// 获取验证码图片
export const getCaptcha = async function () {
    return await request.get('/api/v1/captcha');
}

// 获取手机验证码
export const getCode = async function (mobile) {
    return await request.get('/api/v1/sms/' + mobile);
}

// 手机验证
export const verifyMobile = async function (params) {
    return await request.post('/api/v1/login/verifyMobile', params);
}
// 登陆
export const login = async function (params) {
    return await request.post('/api/v1/login', params);
}
// 退出登录
export const logout = async function () {
    return await request.post('/api/v1/logout');
}

// 重置密码
export const changePassword = async function (password, newPassword) {
    return await request.post('/api/v1/changepasswd', {password: password, newPassword: newPassword})
}

/*
* 玩家管理
* */
// 玩家列表
export const getPlayerList = async function () {
    return await request.get('/api/v1/players');
}
// 获取指定id玩家详情
export const getPlayerDetailById = async function(id) {
    return await request.get('/api/v1/players/' + id);
}
// 封禁
export const banPlayer = async function (id) {
    return await request.post('/api/v1/players/' + id + '/block');
}
// 解封
export const relievePlayer = async function (id) {
    return await request.post('/api/v1/players/' + id + '/unblock');
}

/*
* 装修管理
* */
// 装修列表
export const getDecorationsList = async function () {
    return await request.get('/api/v1/decorations');
}
// 添加装修
export const addDecoration = async function (params) {
    return await request.post('/api/v1/decorations', params);
}
// 删除装修
export const removeDecorationByURL = async function (params) {
    return await request.del('/api/v1/decorations', params);
}
/*
* 广播管理
* */
// 获取广播列表 搜索广播
export const getBroadcastList = async function (params) {
    let strParams = '';
    for (let k in params) {
        if (params[k]) {
            strParams += '&' + k + '=' + params[k];
        }
        if (k === 'page' && !params[k]) {
            strParams += '&page=1';
        }
    }
    return await request.get('/api/v1/broadcasts?size=10' + strParams);
}
// 添加广播
export const addBroadcast = async function (params) {
    return await request.post('/api/v1/broadcasts', params);
}
// 获取指定id广播
export const getBroadcastById = async function (id) {
    return await request.get('/api/v1/broadcasts/' + id);
}
// 更新制定id广播
export const updateBroadcastById = async function (id, params) {
    return await request.put('api/v1/broadcasts/' + id, params);
}
// 删除指定id广播
export const deleteBroadcastById = async function (id) {
    return await request.del('/api/v1/broadcasts/' + id);
}
/*
* 京东卡管理
* */
// 添加京东卡
export const addJDCard = async function(params) {
    return await request.post('/api/v1/jdcards/bulk', {jdcardArr: params});
}
// 获取京东卡列表
export const getJDCardList = async function(params) {
    let strP = ''
    for (let k in params) {
        if (params[k]) {
            strP += '&' + k + '=' + params[k];
        }
    }
    return request.get('/api/v1/jdcards?size=10' + strP);
}
// 删除指定id京东卡
export const deleteJDCardById = async function (id) {
    return await request.del('/api/v1/jdcards/' + id);
}
// 获取指定id京东卡
export const getJDCardById = async function (id) {
    return await request.get('/api/v1/jdcards/' + id);
}
// 更新指定id京东卡
export const updateJDCardById = async function(id, params) {
    return await request.put('/api/v1/jdcards/' + id, params)
}

// 保存用户信息至本地
export const saveUserAction = {
    setUserInfoByKey (key, value) {
        let userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        userInfo[key] = value;
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    getUserInfoByKey (key) {
        let userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        return userInfo['key']
    }
}