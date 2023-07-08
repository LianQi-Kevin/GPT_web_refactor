<script setup>
import {Printer, Promotion, Refresh, Setting} from "@element-plus/icons-vue";
import {getChatGPTResponse} from "@/network/chat.js";
import {reactive, ref} from "vue";

// props
const props = defineProps({
    conversations: {
        type: Object,
        required: true,
        default: [{id: 1, role: 'system', content: 'You are a helpful assistant.', loading: false}]
    },
    showParameter: {
        type: Boolean,
        required: true,
        default: false
    }
})
defineEmits(['update:conversations', 'update:showParameter'])

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

const modelNameList = [
    {label: 'GPT-3.5', value: 'gpt-3.5-turbo'},
    {label: 'GPT-4-8k', value: 'gpt-4-8k'},
    {label: 'GPT-4-32K', value: 'gpt-4-32k'}
]

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
</script>

<template>
    <div class="PromptArea">
        <div class="controlBtn">
            <el-button :icon="Setting" class="btn" circle @click="showParameter = true"/>
            <el-button :icon="Printer" class="btn" circle style="display: none"/>
            <el-button :icon="Refresh" class="btn" circle @click="restartConversation(conversations)" />
        </div>
        <div class="promptBox">
            <el-input type="textarea" v-model="prompt" maxlength="2000" autofocus resize="none"
                      @keydown.enter.native="addConversation" :autosize="{ minRows: 1, maxRows: 6 }"
                      placeholder="随便说些什么吧... ( ctrl + enter 换行)"/>
        </div>
        <div class="submitBtn">
            <el-button :icon="Promotion" class="basic" type="success" plain @click="addConversation" />
        </div>
    </div>
    <div class="Setting" style="position: absolute">
        <el-drawer v-model="props.showParameter" direction="ltr" title="Model Parameter" size="300px" >
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
        flex-basis: 100px;
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
@media screen and (max-width: 480px) {
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