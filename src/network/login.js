import axios from 'axios'
import { setLocalStorage } from '../storageUtils/localStorage.js'
import { setCookie } from "../storageUtils/cookies.js";
import { ElMessage } from "element-plus";

const localAxios = axios.create({
    baseURL: "http://127.0.0.1:5000",
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000
})

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
        // sessionStorage.setItem('user_info', userInfo.data['data'])
        return userInfo.data['data']

    } catch (err) {
        console.error(err.response['status'])
        ElMessage({showClose: true,
            message: err,
            type: 'error',})
        // console.error(err.response['data'])
    }
}
