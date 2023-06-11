<script setup>
import {Delete, Download, Position, Setting} from "@element-plus/icons-vue";
import 'element-plus/es/components/divider/style/css'
import { ref } from "vue";

// prompt
const prompt = ref('')

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

const placeholderArea = '<div style="width: 100%; height: 20px; background-color: #8cc499; margin: 20px 0 0 0" />'

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
                    <div class="flex items-center">
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
            <el-scrollbar>
                <div v-for="element in conversations" :key="element.id">
                    <div v-html="element.component" />
                </div>
            </el-scrollbar>
        </div>

        <div class="promptArea" id="footer">
            <div style="height: 15px; width: 100%"/>
            <el-row justify="space-around">
                <el-col :span="3" style="min-width: 120px; flex-shrink: 0">
                    <el-button :icon="Setting" class="btn" circle :disabled="true" />
                    <el-button :icon="Download" class="btn" circle :disabled="true" />
                    <el-button :icon="Delete" class="btn" circle :disabled="true" />
                </el-col>
                <el-col :span="18" style="flex-shrink: 50">
                    <el-input type="textarea" v-model="prompt" maxlength="2000" autofocus id="prompt"
                              :autosize="{ minRows: 1, maxRows: 7 }" placeholder="Prompt here"/>
                </el-col>
                <el-col :span="3" style="flex-shrink: 0">
                    <el-button :icon="Position" class="btn submit basic" plain @click="addConversation(prompt)" />
                </el-col>
            </el-row>
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
    //background: linear-gradient(#ffffff, #409EFF);
    background: #18222c;
    border-radius: 0;
}

div.chatArea {
    width: 100%;
    --subtract-height: 110px;
    max-height: calc(100vh - var(--subtract-height));
}

.el-scrollbar {
    --subtract-height: 110px;
    max-height: calc(100vh - var(--subtract-height));
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

div.promptArea {
    position: absolute;
    bottom: 15px;
    width: 100%;
    min-height: 50px;
    max-height: 200px;
    border-top: #CFD3DC 3px solid;
}

.el-textarea {
    min-width: 200px;
    max-width: 800px;
}

.el-row {
    align-items: flex-end;
}

.btn {
    color: #000000;
    //background: rgba(255, 255, 255, 0.0);
    background: #66b1ff;
    border: #3375b9 1px solid;
}

.btn.submit {
    max-width: 80px;
    max-height: 40px;
    color: #000000;
    background: #67C23A;
}
</style>