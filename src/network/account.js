import localAxios from "@/network/basicAPI.js";
import {setSessionStorage} from "@/storageUtils/sessionStorage.js";

export async function getUserInfo(accessToken){
    try {
        const response = await localAxios.get(
            '/account', {headers: {'Authorization': `Bearer ${accessToken}`}})
        setSessionStorage('user_info', response.data['data'])
        return {type: 'success', value: response.data['data']}
    } catch (err) {
        console.error(err)
    }
}