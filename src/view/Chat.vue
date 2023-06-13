<script setup>
import {Delete, Download, Position, Setting} from "@element-plus/icons-vue";
import { ref, reactive } from "vue";

// prompt
const prompt = ref('')
const requesting = ref(false)

// router back
const goBack = () => {
    console.log('go back')
}

// chat area list
// const chatBotExample = ChatBot;
const conversations = reactive([{id: 0, component: '<div class="ChatBot" style="margin: 20px 0 0 0">Basic Message</div>'}])

const localTime = ref(new Date().toLocaleString('zh-CN', { hour12: false }));

// const dividerMSG = "22:51:17 [vite] hmr update /src/view/Chat.vue"
const dividerMSG = '<div class="ChatBot">22:51:17 [vite] hmr update /src/view/Chat.vue</div>'

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
            conversations.push({
                id: conversations.length + 1,
                component: prompt.value
            })
            console.log(conversations)
            prompt.value = ""   // 重置prompt的值
        }
        e.preventDefault();  // 阻止浏览器默认的敲击回车换行的方法
    }
}

// 侧边栏设置列表
const showDrawer = ref(false)
const infoForm = reactive({
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "top_p": 0.7,
    "max_tokens": 2048,
    "num_result": 1,
    "presence_penalty": 0,
    "frequency_penalty": 0
})
const modelNameList = [
    {label: 'GPT-3.5', value: 'gpt-3.5-turbo'},
    {label: 'GPT-4-8k', value: 'gpt-4-8k'},
    {label: 'GPT-4-32K', value: 'gpt-4-32k'}]
</script>

<template>
    <div class="container basic">
        <div class="title basic" style="border-bottom: #CFD3DC 3px solid; max-height: 40px;" id="header">
            <el-page-header @back="goBack" style="padding: 5px 30px 0 10px">
                <template #content>
                    <span class="text-large font-600 mr-3" style="color: white">Chat-GPT</span>
                </template>
            </el-page-header>
        </div>

        <div class="chatArea" id="main">
            <div class="bot">
                <img src="@/assets/svg/chatAvatar.svg" alt="botIcon" class="avatar"/>
                <div class="chat">
                    <div class="botTime">{{ localTime }}</div>
                    <div class="botMsg" v-html="dividerMSG" />
                </div>
            </div>
            <div class="user">
                <img src="@/assets/svg/userAvatar.svg" alt="userIcon" class="avatar" />
                <div class="chat">
                    <div class="userTime">{{ localTime }}</div>
                    <div class="userMsg" v-html="dividerMSG" />
                </div>
            </div>
<!--            <div v-for="element in conversations" :key="element.id">-->
<!--                <div v-html="element.component" />-->
<!--            </div>-->
        </div>
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
                    <el-form-item label="Max Tokens">
                        <el-input-number v-model="infoForm.max_tokens" :min="500" :max="4000"/>
                    </el-form-item>
                    <el-form-item label="Num Result" disabled="true">
                        <el-input-number v-model="infoForm.num_result" :min="1" disabled/>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>
        <div class="promptDivide" />
        <div class="promptArea">
            <div class="controlBtn">
                <el-button :icon="Setting" class="btn" circle @click="showDrawer = true"/>
                <el-button :icon="Download" class="btn" circle :disabled="requesting" />
                <el-button :icon="Delete" class="btn" circle :disabled="requesting" />
            </div>
            <div class="promptBox">
                <el-input type="textarea" v-model="prompt" maxlength="2000" autofocus resize="none" show-word-limit
                          @keydown.enter.native="addConversation" :autosize="{ minRows: 1, maxRows: 10 }"
                          placeholder="随便说些什么吧... ( ctrl + enter 换行)"/>
            </div>
            <div class="submitBtn">
                <el-button :icon="Position" class="basic" type="success"
                           plain @click="addConversation" />
            </div>
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
    //background: #141414;
    background: #18222c;
    border-radius: 0;
}

div.chatArea {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100vw;
    --subtract-height: 60px;
    max-height: calc(100vh - var(--subtract-height));
    overflow: auto;

    .bot{
        display: flex;
        flex-direction: row;
        max-width: 80vw;
        margin: 15px auto 0 10px;
        .avatar {
            width: 40px;
            height: 40px;
        }
        .chat {
            display: flex;
            flex-direction: column;
            margin-left: 5px;
            .botTime {
                font-size: 13px;
                text-align: left;
                color: #8D9095;
            }
            .botMsg {
                font-size: 15px;
                background-color: #1D1E1F;
                text-align: left;
                border: #6C6E72 2px solid;
                border-radius: 2px 10px 10px 10px;
                padding: 7px;
            }
        }
    }
    .user {
        display: flex;
        flex-direction: row-reverse;
        max-width: 80vw;
        margin: 15px 10px 0 auto;
        .avatar {
            width: 40px;
            height: 40px;
        }
        .chat {
            display: flex;
            flex-direction: column;
            margin-right: 5px;
            .userTime {
                font-size: 13px;
                text-align: right;
                color: #8D9095;
            }
            .userMsg {
                font-size: 15px;
                background-color:  #1D1D1D;
                text-align: left;
                border: #6C6E72 2px solid;
                border-radius: 10px 2px 10px 10px;
                padding: 7px;
            }
        }
    }
}

div.promptDivide {
    position: absolute;
    width: 100%;
    bottom: 60px;
    border-top: white 3px solid;
}

div.promptArea {
    // absolute position
    position: absolute;
    bottom: 15px;
    width: 100%;
    min-height: 50px;
    max-height: 200px;

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
        flex-grow: 2;
        flex-basis: 300px;
        min-width: 200px;
    }

    .submitBtn {
        flex-basis: 80px;
        margin: 0 30px 0 15px;
    }
}

// For mobile
@media screen and (max-width: 544px) {
    .modelChoice {
        display: none;
    }

    div.chatArea {
        --subtract-height: 160px;
    }

    div.promptDivide {
        bottom: 100px;
        //display: none;
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

.el-textarea {
    min-width: 200px;
    max-width: 800px;
}

.el-row {
    align-items: flex-end;
}

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