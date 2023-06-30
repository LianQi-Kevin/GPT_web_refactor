import localAxios from "./basicAPI.js"
import {ElMessage} from "element-plus";

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
        const chatGPTResponse = await localAxios.post(
            '/chat/azure', JSON.stringify(requestJson)
        )
        return {type: 'success', value: chatGPTResponse.data["data"]}
    } catch (err) {
        ElMessage({
            type: 'error',
            message: err.response.data['message'],
            duration: 5000,
            showClose: true
        })
        return {type: 'error', value: err}
    }
}