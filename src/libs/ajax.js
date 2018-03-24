import axios from 'axios';
import env from '../../build/env';

const ajaxUrl = env === 'development'
    ? 'http://192.168.28.128:7001'
    : env === 'production'
        ? 'http://www.url.com'
        : 'http://192.168.28.128:7001';

// const request = axios.create({
//     base: ajaxUrl,
//     timeout: 30000
// });
// axios.defaults.baseURL = ajaxUrl;
const request = {}

request.post = function (url, data = {}) {
    return axios({
        method: 'POST',
        url: url,
        data: data
    });
}
request.get = function (url, data = {}) {
    return axios({
        method: 'GET',
        url: url,
        data: data
    });
}

request.delete = function (url, data = {}) {
    return axios({
        method: 'DELETE',
        url: url,
        data: data
    });
}

request.put = function (url, data) {
    return axios({
        method: 'PUT',
        url: url,
        data: data
    });
}

export const post = function (url, data) {
    data = data || null;
    return new Promise((resolve, reject) => {
        request.post(url, data).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
};

export const get = function (url, data) {
    data = data || null;
    return new Promise((resolve, reject) => {
        request.get(url, data).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
};

export const del = function (url, params = {}) {
    return new Promise((resolve, reject) => {
        request.delete(url, params).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}

export const put = function (url, data) {
    return new Promise((resolve, reject) => {
        request.put(url, data).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}
