import LocalAxios from "@/network/basicAPI.js";
import {setLocalStorage} from "@/storageUtils/localStorage.js";

const accountAxios = new LocalAxios()

export async function getUserInfo(accessToken){
    try {
        const response = await accountAxios.get(
            '/account', {headers: {'Authorization': `Bearer ${accessToken}`}})
        setLocalStorage('user_info', response.data['data'], '15d')
        return {type: 'success', value: response.data['data']}
    } catch (err) {
        console.error(err)
    }
}