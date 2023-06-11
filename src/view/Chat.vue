<script setup>
import {Delete, Download, Position, Setting} from "@element-plus/icons-vue";
import 'element-plus/es/components/divider/style/css'
import { ref } from "vue";

// prompt
const prompt = ref('')
const requesting = ref(true)

// model select
const modelName = ref('GPT-3.5')
const modelNameList = [
    {
        label: 'GPT-3.5',
        value: 'gpt-35-turbo'
    },
    {
        label: 'GPT4-8k',
        value: 'gpt-4'
    },
    {
        label: 'GPT4-32K',
        value: 'gpt-4-32k'
    }
]

// router back
const goBack = () => {
    console.log('go back')
}

// chat area list
// const chatBotExample = ChatBot;
const conversations = reactive([
    {
        id: 0,
        component: '<div class="ChatBot" style="margin: 20px 0 0 0">Basic Message</div>'
    },
])

const placeholderArea = '<div style="width: 80vw; height: 20px; background-color: #8cc499; margin: 20px 0 0 0" />'

const localTime = ref(new Date().toLocaleString('zh-CN', { hour12: false }));

// const dividerMSG = "22:51:17 [vite] hmr update /src/view/Chat.vue"
const dividerMSG = '<div class="ChatBot">22:51:17 [vite] hmr update /src/view/Chat.vue</div>'


function addConversation(msg) {
    console.log(msg)
    conversations.push({
        id: conversations.length + 1,
        // component: placeholderArea
        component: placeholderArea
    })
}
</script>

<template>
    <div class="container basic">
        <div class="title basic" style="border-bottom: #CFD3DC 3px solid; max-height: 40px;" id="header">
            <el-page-header @back="goBack" style="padding: 5px 30px 0 10px">
                <template #content>
                    <span class="text-large font-600 mr-3" style="color: white">Chat-GPT</span>
                </template>
                <template #extra>
                    <div class="flex items-center modelChoice">
                        <label>Model : </label>
                        <el-select v-model="modelName" class="m-2" placeholder="Model select" size="small">
                            <el-option
                                v-for="item in modelNameList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                </template>
            </el-page-header>
        </div>

        <div class="chatArea" id="main">
            <div class="bot">
                <img src="@/assets/svg/pwa-192x192.svg" alt="botIcon" class="botIcon"/>
<!--                <el-avatar style="min-width: 40px" src="@/../public/pwa-192x192.png"/>-->
                <div class="chat">
                    <div class="botTime">{{ localTime }}</div>
                    <div class="botMsg" v-html="dividerMSG" />
                </div>
            </div>
<!--            <div v-for="element in conversations" :key="element.id">-->
<!--                <div v-html="element.component" />-->
<!--            </div>-->
        </div>
        <div class="promptDivide" />
        <div class="promptArea">
            <div class="controlBtn">
                <el-button :icon="Setting" class="btn" circle :disabled="requesting" />
                <el-button :icon="Download" class="btn" circle :disabled="requesting" />
                <el-button :icon="Delete" class="btn" circle :disabled="requesting" />
            </div>
            <div class="promptBox">
                <el-input type="textarea" v-model="prompt" maxlength="2000" autofocus
                          :autosize="{ minRows: 1, maxRows: 7 }" placeholder="Prompt here"/>
            </div>
            <div class="submitBtn">
                <el-button :icon="Position" class="basic" type="success"
                           plain @click="addConversation(prompt)" />
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
        max-width: 70vw;
        margin: 15px auto 0 10px;
        .botIcon {
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
        flex-basis: 100px;
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