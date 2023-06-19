import {toMilliSeconds} from "../utils/durationTime.js";

export function setSessionStorage(key, value, expiry) {
    /* 设置SessionStorage键值对，expiry为过期时间(从当前时间起算, UTC时间) */
    const now = new Date()
    const item = {value: value}
    if (typeof expiry !== "undefined") {
        item.expiry = now.setTime(now.getTime() + toMilliSeconds(expiry))
    }
    sessionStorage.setItem(key, JSON.stringify(item))
    console.debug(`set sessionStorage ${item}`)
    return item
}

export function getSessionStorage(key) {
    const itemStr = sessionStorage.getItem(key)
    if (!itemStr) {
        return null
    }
    const item = JSON.parse(itemStr)
    if (typeof item.expiry !== "undefined") {
        const now = new Date()
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
        }
    }
    return item.value
}