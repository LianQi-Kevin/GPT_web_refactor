import LocalAxios from "./basicAPI.js"
import {ElMessage} from "element-plus";
import {accessTokenAdd} from "@/network/interceptors.js";

const chatAxios = new LocalAxios()
chatAxios.interceptors.request.use(accessTokenAdd)

export async function getChatGPTResponse(conversations, configs) {
    try{
        const requestJson = {
            model_name: configs.model,
            messages: conversations.map(item => {
                return {role: item.role, content: item.content};
            }).slice(0, conversations.length - 1),
            temperature: configs.temperature,
            top_p: configs.top_p,
            max_tokens: configs.max_response_tokens,
            num_result: configs.num_result,
            presence_penalty: configs.presence_penalty,
            frequency_penalty: configs.frequency_penalty
        }

        // if (process.env.NODE_ENV === "development") {
        //     return {type: 'success', value: {messages: [{message: {content: conversations.at(-2).content}}]}}
        // }

        // 创建请求
        const chatGPTResponse = await chatAxios.post(
            '/chat/azure', JSON.stringify(requestJson)
        )

        return {type: 'success', value: chatGPTResponse.data["data"]}
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