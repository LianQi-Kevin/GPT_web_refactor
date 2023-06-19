/*
* key: cookie name
* value: cookie value
* maxAge: expiry time, eg: 1s, 10m, 15h, 5d, 2w, 2M, 1y
* */

import {toSeconds} from "../utils/durationTime.js";

export function setCookie(key, value, maxAge) {
    console.debug(`set cookie ${{key: value}}`)
    if (maxAge !== undefined){
        document.cookie = key + '=' + value + '; max-age=' + toSeconds(maxAge) + "; path=/"
    } else {
        document.cookie = key + '=' + value + "; path=/"
    }
}

export function getCookie(key) {
    const cookie_arr = document.cookie.split('; ');
    for (let k of cookie_arr) {
        let res = k.split('=');
        if (res[0] === key) {
            return res[1];
        }
    }
    return null
}

export function removeCookie(key){
    /* 将cookie的过期时间设置0s后，借用过期删除机制实现 */
    document.cookie = key + '=value; max-age=0'
}

