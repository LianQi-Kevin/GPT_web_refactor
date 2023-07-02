<script setup>
import { Refresh, Promotion, Setting, Printer } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import ChatItem from "@/components/ChatItem.vue";
import "highlight.js/styles/monokai.css"
import {getChatGPTResponse} from "@/network/chat.js";
import {useRouter} from "vue-router";

const router = useRouter()

// prompt
const prompt = ref('')
const requesting = ref(false)

// router back
const goBack = () => {
    router.back()
}

// chat area list
const defaultSystemMsg = ref('You are a helpful assistant.')
const conversations = reactive([{ id: 0, role: "system", content: defaultSystemMsg.value, loading: false}])

function restartConversation(conversations) {
    // 重置对话列表
    for (let i = 0; i < conversations.length; i++) {
        if (conversations[i].role !== "system") {
            conversations.splice(i, 1);
            i--;
        }
    }
}

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
            conversations.push({
                id: conversations.length + 1,
                role: 'user',
                content: prompt.value,
                loading: false
            })
            prompt.value = ""   // 重置prompt的值
            // 请求并等待
            conversations.push({
                id: conversations.length + 1,
                role: 'assistant',
                content: "Waiting...",
                loading: true
            })
            getChatGPTResponse(conversations, infoForm).then(result => {
                if (result.type === "success") {
                    conversations.at(-1).content = result.value["messages"][0]["message"]["content"]
                    conversations.at(-1).loading = false
                }
            })
        }
        e.preventDefault();  // 阻止浏览器默认的敲击回车换行的方法
    }
}

// 侧边栏设置列表
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
const modelNameList = [
    {label: 'GPT-3.5', value: 'gpt-3.5-turbo'},
    {label: 'GPT-4-8k', value: 'gpt-4'},
    {label: 'GPT-4-32K', value: 'gpt-4-32k'}]
</script>

<template>
    <div class="container basic">
        <div class="title basic" style="border-bottom: #CFD3DC 3px solid; max-height: 40px;">
            <el-page-header @back="goBack" style="padding: 5px 30px 0 10px">
                <template #content>
                    <span class="text-large font-600 mr-3" style="color: white">Chat-GPT</span>
                </template>
            </el-page-header>
        </div>
        <div class="chatArea">
            <div class="conversations">
                <div v-for="element in conversations" :key="element.id">
                    <ChatItem :markdown="element.content" :role="element.role" v-model:loading="element.loading"/>
                </div>
            </div>
        </div>
        <div class="promptArea">
            <div class="controlBtn">
                <el-button :icon="Setting" class="btn" circle @click="showDrawer = true"/>
                <el-button :icon="Printer" class="btn" circle :disabled="requesting" />
                <el-button :icon="Refresh" class="btn" circle @click="restartConversation(conversations)" />
            </div>
            <div class="promptBox">
                <el-input type="textarea" v-model="prompt" maxlength="2000" autofocus resize="none" show-word-limit
                          @keydown.enter.native="addConversation" :autosize="{ minRows: 1, maxRows: 10 }"
                          placeholder="随便说些什么吧... ( ctrl + enter 换行)"/>
            </div>
            <div class="submitBtn">
                <el-button :icon="Promotion" class="basic" type="success" plain @click="addConversation" />
            </div>
        </div>
        <div class="other" style="position: absolute">
            <el-drawer v-model="showDrawer" direction="ltr" title="Model Parameter" size="300px" >
                <div class="demo-drawer__content">
                    <el-form :model="infoForm" label-position="top">
                        <el-form-item label="Model Name">
                            <el-select v-model="infoForm.model" class="m-2" placeholder="Select">
                                <el-option v-for="item in modelNameList" :key="item.value"
                                           :label="item.label" :value="item.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Temperature">
                            <el-slider v-model="infoForm.temperature" :min="0" :max="2" :step="0.1"/>
                        </el-form-item>
                        <el-form-item label="Top-p">
                            <el-slider v-model="infoForm.top_p" :min="0" :max="2" :step="0.1" />
                        </el-form-item>
                        <el-form-item label="Presence Penalty">
                            <el-slider v-model="infoForm.presence_penalty" :min="-2" :max="2" :step="0.1"/>
                        </el-form-item>
                        <el-form-item label="Frequency penalty">
                            <el-slider v-model="infoForm.frequency_penalty" :min="-2" :max="2" :step="0.1"/>
                        </el-form-item>
                        <el-form-item label="Max Response Tokens">
                            <el-input-number v-model="infoForm.max_response_tokens" :min="500" :max="4000"/>
                        </el-form-item>
                        <el-form-item label="Num Result" disabled="true">
                            <el-input-number v-model="infoForm.num_result" :min="1" disabled/>
                        </el-form-item>
                    </el-form>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<style scoped lang="scss">
.basic {
    height: 100%;
    width: 100%;
}

.container {
    min-height: 100vh;
    max-height: 100vh;
    background: #3a3a3a;
    //background: #18222c;
    border-radius: 0;

    // for inner item
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

div.chatArea {
    // for site
    flex-grow: 2;

    // for inner item
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100vw;
    --subtract-height: 60px;
    max-height: calc(100vh - var(--subtract-height));
    overflow: auto;

    .conversations {
        width: 100vw;
        max-height: 95vh;
        overflow: auto;
    }
}

div.promptArea {
    //bottom: 15px;
    width: 100%;
    min-height: 50px;
    max-height: 200px;
    margin-bottom: 20px;

    // flex item
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;

    // item
    .controlBtn {
        flex-basis: 144px;
        //margin: 0 30px 0 30px;
    }

    .promptBox {
        // External positioning
        flex-grow: 2;
        flex-basis: 300px;
        min-width: 200px;
    }

    .submitBtn {
        button {
            background-color: rgba(0,0,0,0);
        }
        flex-basis: 50px;
        margin: 0 30px 0 15px;
    }
}

// For mobile
@media screen and (max-width: 544px) {
    div.chatArea {
        --subtract-height: 160px;
    }

    div.promptArea {
        bottom: 15px;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .controlBtn {
            display: none;
        }

        .promptBox {
            position: absolute;
            bottom: 40px;
            width: 90vw;
            margin: 15px 15px 0 15px;
        }

        .submitBtn {
            margin: 15px 15px 0 15px;
            width: 90vw;
            max-height: 30px;
        }
    }
}

//.el-textarea {
//    min-width: 200px;
//    max-width: 800px;
//}

//.el-row {
//    align-items: flex-end;
//}

.btn {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.0);
    //background: #66b1ff;
    border: #3375b9 1px solid;
}

.btn.submit {
    color: #ffffff;
    //background: #9dc781;
}
</style>