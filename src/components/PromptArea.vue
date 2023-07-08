<script setup>
import {Promotion, Refresh} from "@element-plus/icons-vue";
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

// 模型设置
const infoForm = reactive({
    "model": 'gpt-3.5-turbo',
    "temperature": 1,
    "top_p": 1,
    "max_response_tokens": 2048,
    "num_result": 1,
    "presence_penalty": 0,
    "frequency_penalty": 0
})

// 输入框获得焦点
const inputRef = ref()
onMounted(() => {
    watch(props.conversations, () => {
        nextTick(() =>{
            inputRef.value.focus()
        })
    })
})
</script>

<template>
    <div class="PromptArea">
        <div class="controlBtn">
            <el-button :icon="Refresh" class="btn" @click="restartConversation(conversations)" type="primary" round></el-button>
        </div>
        <div class="promptBox">
            <el-input type="textarea" v-model="prompt" maxlength="2000" autofocus resize="none" show-word-limit
                      @keydown.enter.native="addConversation" :autosize="{ minRows: 1, maxRows: 6 }"
                      placeholder="随便说些什么吧... ( ctrl + enter 换行)" ref="inputRef"/>
        </div>
        <div class="submitBtn">
            <el-button :icon="Promotion" class="basic" type="success" plain @click="addConversation"></el-button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.PromptArea {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;

    padding-top: 10px;

    margin-top: 5px;
    margin-bottom: 20px;

    .controlBtn {
        flex-basis: 40px;
        margin-right: 15px;
        margin-left: 30px;
    }

    .promptBox {
        flex-grow: 2;
        flex-basis: 300px;
        min-width: 200px;
    }

    .submitBtn {
        flex-basis: 80px;
        margin: 0 30px 0 15px;
        width: 80%;

        .el-button {
            width: 100%;
        }
    }
}

// For Mobile
@media screen and (max-width: 540px) {
    .PromptArea {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 0;
        padding-top: 10px;

        .controlBtn {
            display: none;
        }

        .promptBox {
            width: 90%;
            flex-grow: 1;
            flex-basis: 30px;
            //padding-top: 5px;
        }

        .submitBtn {
            margin: 0;
            padding-top: 10px;
            width:90%;
            flex-basis: 45px;

            .el-button{
                width: 100%;
            }
        }

    }
}
</style>