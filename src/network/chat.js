import LocalAxios from "./basicAPI.js"
import {ElMessage} from "element-plus";
import {accessTokenAdd} from "@/network/interceptors.js";

const chatAxios = new LocalAxios()
chatAxios.interceptors.request.use(accessTokenAdd)

export async function getChatGPTResponse(conversations, configs) {
    try{
        const requestJson = {
            model_name: configs.model,
            messages: conversations.map(item => {return { role: item.role, content: item.content };}),
            temperature: configs.temperature,
            top_p: configs.top_p,
            max_tokens: configs.max_response_tokens,
            num_result: configs.num_result,
            presence_penalty: configs.presence_penalty,
            frequency_penalty: configs.frequency_penalty
        }

        /* 在开发环境下暂时禁用实际请求以节省token */
        // if (process.env.NODE_ENV === "development") {
        //     return {type: 'success', value: {messages: [{message: {content: "yes"}}]}}
        // }

        // 添加请求拦截器并创建请求
        const chatGPTResponse = await chatAxios.post(
            '/chat/azure', JSON.stringify(requestJson)
        )

        return {type: 'success', value: chatGPTResponse.data["data"]}
    } catch (err) {
        ElMessage({
            type: 'error',
            message: err.response.data,
            duration: 5000,
            showClose: true
        })
        return {type: 'error', value: err}
    }
}