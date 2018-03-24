import { post, get, del, put } from '@/libs/ajax';

/*
* 获取游戏列表
* */
export const fetchGameList = function (page, size) {
    page = page || 1;
    size = size || 10;
    return new Promise((resolve, reject) => {
        get('/api/v1/games?sort=createdAt&size=' + size + '&page=' + page, null).then(data => {
            resolve({
                code: data.status.code,
                msg: data.status.message,
                list: data.data.docs,
                count: data.data.count
            });
        }).catch(error => {
            reject(error);
        });
    });
}

/*
* 添加游戏
* */
export const addGameAction = function (data) {
    return new Promise((resolve, reject) => {
        post('/api/v1/games', data).then(data => {
            resolve({
                code: data.status.code,
                msg: data.status.message,
                data: data.data
            });
        }).catch(error => {
            reject(error);
        });
    });
}

/*
* 获取指定ID游戏详情
* */
export const getGameDetailById = function (_id) {
    return new Promise((resolve, reject) => {
        get('/api/v1/games/' + _id, null).then(data => {
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
}

/*
* 删除指定ID游戏 delete
* */
export const delGameById = function (_id) {
    return new Promise((resolve, reject) => {
        del('/api/v1/games/' + _id).then(data => {
            resolve({
                code: data.status.code,
                msg: data.status.message,
                data: data.data
            });
        }).catch(error => {
            reject(error);
        });
    });
}

/*
* 修改指定ID游戏
* */
export const editGameById = function (_id, data) {
    return new Promise((resolve, reject) => {
        put('/api/v1/games/' + _id, data).then(data => {
            resolve({
                code: data.status.code,
                msg: data.status.message,
                data: data.data
            });
        }).catch(error => {
            reject(error);
        });
    });
}
