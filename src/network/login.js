import {getLocalStorage, setLocalStorage} from '@/storageUtils/localStorage.js'
import { setCookie } from "@/storageUtils/cookies.js";
import 'element-plus/es/components/message/style/css'
import { ElMessage } from "element-plus";
import LocalAxios from "@/network/basicAPI.js"
import {getUserInfo} from "@/network/account.js";

const loginAxios = new LocalAxios

export async function userLogin(username, password) {
    try {
        // user login
        const loginResponse = await loginAxios.post(
            '/login', JSON.stringify({username: username, password: password})
        );
        const accessToken = loginResponse.data['data']['access_token']
        const refreshToken = loginResponse.data['data']['refresh_token']

        // login successful, get user info
        const userInfo = await getUserInfo(accessToken)

        // set info to storage
        setLocalStorage('refresh_token', refreshToken,
            userInfo.value['role'] === 'admin' ? '3d' : '15d')
        setCookie('jwt_token', accessToken, '14m')
        ElMessage({
            type: 'success',
            message: 'Successful Login, Jumping...',
            duration: 3000
        })
        return {type: 'success', value: userInfo.value}
    } catch (err) {
        console.error(err)
        ElMessage({
            type: 'error',
            message: err.response.data.message ? err.response.data.message : `${err.response.status} ${err.response.statusText}`,
            duration: 5000,
            showClose: true
        })
        return {type: 'error', value: err}
    }
}

export async function refreshToken() {
    const refreshToken = getLocalStorage('refresh_token')
    if (refreshToken !== null) {
        try {
            const response = await loginAxios.post(
                '/refresh', '', {headers: {'Authorization': `Bearer ${refreshToken}`}}
            )
            setCookie('jwt_token', response.data['data']['access_token'], '14m')
            return {type: 'success', value: response.data['data']['access_token']}
        } catch (err) {
            localStorage.removeItem('refresh_token')
            return {type: 'error', value: false, msg: 'refreshToken invalid, Please login again'}
        }
    } else {
        return {type: 'error', value: false, msg: 'refreshToken Not Found, Please login'}
    }
}