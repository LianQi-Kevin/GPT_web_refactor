import {getLocalStorage, setLocalStorage} from '../storageUtils/localStorage.js'
import { setCookie } from "../storageUtils/cookies.js";
import 'element-plus/es/components/message/style/css'
import { ElMessage } from "element-plus";
import LocalAxios from "./basicAPI.js"
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
            message: err.response.data['message'],
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
            const accessToken = response.data['data']['access_token']
            setCookie('jwt_token', accessToken, '14m')
            return {type: 'success', value: accessToken}
        } catch (err) {
            console.error(err.data)
            return {type: 'error', value: err}
        }
    } else {
        return {type: 'error', value: 'Not found refresh token'}
    }
}