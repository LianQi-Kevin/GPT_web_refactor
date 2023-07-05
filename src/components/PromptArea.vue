<script setup>
import {Promotion} from "@element-plus/icons-vue";
import {getChatGPTResponse} from "@/network/chat.js";
import {reactive, ref} from "vue";

// props
const props = defineProps({
    conversations: {
        type: Object,
        required: true,
        default: [{id: 1, role: 'system', content: 'You are a helpful assistant.', loading: false}]
    }
})
defineEmits(['update:conversations'])

const prompt = ref('')

function notAllNewLines(str) {
    // 检查字符串是否全部由\n组成
    return ! /^(\n)+$/.test(str);
}

function addConversation(e) {
    // 处理enter提交，ctrl+enter回车
    if(e.ctrlKey && e.keyCode===13) {
        // ctrl+enter触发
        prompt.value += '\n';
    } else {
        // enter触发, 条件阻止空内容触发请求
        if (prompt.value !== "" && notAllNewLines(prompt.value)) {
            // 添加user
            props.conversations.push({
                id: props.conversations.length + 1,
                role: 'user',
                content: prompt.value,
                loading: false
            })
            prompt.value = ""   // 重置prompt的值
            // 请求并等待
            props.conversations.push({
                id: props.conversations.length + 1,
                role: 'assistant',
                content: "Waiting...",
                loading: true
            })
            getChatGPTResponse(props.conversations, infoForm).then(result => {
                if (result.type === "success") {
                    props.conversations.at(-1).content = result.value["messages"][0]["message"]["content"]
                    props.conversations.at(-1).loading = false
                }
            })
        }
        e.preventDefault();  // 阻止浏览器默认的敲击回车换行的方法
    }
}

function restartConversation() {
    // 重置对话列表
    for (let i = 0; i < props.conversations.length; i++) {
        if (props.conversations[i].role !== "system") {
            props.conversations.splice(i, 1);
            i--;
        }
    }
}

// 侧边栏设置
const showDrawer = ref(false)
const infoForm = reactive({
    "model": "gpt-3.5-turbo",
    "temperature": 1,
    "top_p": 1,
    "max_response_tokens": 2048,
    "num_result": 1,
    "presence_penalty": 0,
    "frequency_penalty": 0
})
</script>

<template>
    <div class="promptBox">
        <el-input type="textarea" v-model="prompt" maxlength="2000" autofocus resize="none" show-word-limit
                  @keydown.enter.native="addConversation" :autosize="{ minRows: 1, maxRows: 10 }"
                  placeholder="随便说些什么吧... ( ctrl + enter 换行)"/>
    </div>
    <div class="submitBtn">
        <el-button :icon="Promotion" class="basic" type="success" plain @click="addConversation" />
    </div>
</template>

<style scoped lang="scss">

</style>