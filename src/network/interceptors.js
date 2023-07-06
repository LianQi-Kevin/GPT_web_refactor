import {getCookie} from "@/storageUtils/cookies.js";
import {refreshToken} from "@/network/login.js";
import {getLocalStorage} from "@/storageUtils/localStorage.js";
import {ElMessage} from "element-plus";

export async function accessTokenAdd(config) {
    let accessToken = getCookie('jwt_token');
    // 如果access_token过期, 则刷新access_token
    if (accessToken === null) {
        await refreshToken().then(result => {
            if (result.type !== 'success') {
                ElMessage({
                    type: 'error',
                    message: 'Login invalid, Please login again!',
                    duration: 3000
                })
            } else {
                accessToken = result.value
            }
        })
    }
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
}

export function refreshTokenAdd(config) {
    let refreshToken = getLocalStorage('refresh_token');
    // 如果access_token过期, 则刷新access_token
    if (refreshToken === null) {
        ElMessage({
            type: 'error',
            message: 'Login invalid, Please login again!',
            duration: 3000
        })
    }
    config.headers.Authorization = `Bearer ${refreshToken}`
    return config
}