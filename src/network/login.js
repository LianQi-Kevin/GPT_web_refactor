import { setLocalStorage } from '../storageUtils/localStorage.js'
import { setCookie } from "../storageUtils/cookies.js";
import { setSessionStorage } from "../storageUtils/sessionStorage.js";
import 'element-plus/es/components/message/style/css'
import { ElMessage } from "element-plus";
import localAxios from "./basicAPI.js"

export async function userLogin(username, password) {
    try {
        // user login
        const loginResponse = await localAxios.post(
            '/login', JSON.stringify({username: username, password: password})
        );
        const accessToken = loginResponse.data['data']['access_token']
        const refreshToken = loginResponse.data['data']['refresh_token']

        // login successful, get user info
        const userInfo = await localAxios.get(
            '/account', {headers: {'Authorization': `Bearer ${accessToken}`}}
        )

        // set info to storage
        setLocalStorage('refresh_token', refreshToken,
            userInfo.data['data']['role'] === 'admin' ? '3d' : '15d')
        setCookie('jwt_token', accessToken, '14m')
        setSessionStorage('user_info', userInfo.data['data'])
        ElMessage({
            type: 'success',
            message: 'Successful Login, jumping',
            duration: 3000
        })

        return {type: 'success', value: userInfo.data['data']}
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
