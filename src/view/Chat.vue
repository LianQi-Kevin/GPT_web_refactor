<script setup>
import { ref, reactive } from "vue";
import ChatItem from "@/components/ChatItem.vue";
import PromptArea from "@/components/PromptArea.vue";
import "highlight.js/styles/monokai.css"
import {useRouter} from "vue-router";

const router = useRouter()

// chat area list
const conversations = reactive([{ id: 0, role: "system", content: 'You are a helpful assistant.', loading: false}])

// 侧边栏设置列表
const showParameter = ref(false)
</script>

<template>
    <div class="container basic">
        <div class="title basic" style="border-bottom: #CFD3DC 3px solid; max-height: 40px;">
            <el-page-header @back="() => {router.back()}" style="padding: 5px 30px 0 10px">
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
        <PromptArea  v-model:conversations="conversations" v-model:show-parameter="showParameter"/>
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
</style>