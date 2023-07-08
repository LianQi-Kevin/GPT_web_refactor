<script setup>
import {reactive, ref} from "vue";
import ChatItem from "@/components/ChatItem.vue";
import PromptArea from "@/components/PromptArea.vue";
import "highlight.js/styles/monokai.css"
import {useRouter} from "vue-router";

const router = useRouter()

// chat area list
const conversations = reactive([{id: 0, role: "system", content: 'You are a helpful assistant.', loading: false}])

// scrollbar
const scrollbarRef = ref()
const conversationsRef = ref()

onMounted(() => {
    watch(conversations, () => {
        nextTick(() => {
            scrollbarRef.value.setScrollTop(conversationsRef.value.clientHeight)
        })
    })
})

// 侧边栏设置列表
const showParameter = ref(false)
</script>

<template>
    <div class="outside basic">
        <div class="container basic">
            <div class="title basic" style="border-bottom: #CFD3DC 3px solid; max-height: 40px;">
                <el-page-header style="padding: 5px 30px 0 10px" @back="() => {router.back()}">
                    <template #content>
                        <span class="text-large font-600 mr-3" style="color: white">Chat-GPT</span>
                    </template>
                </el-page-header>
            </div>
            <div class="chatArea">
                <el-scrollbar style="width: 100%" :noresize="false" ref="scrollbarRef">
                    <div class="conversations" ref="conversationsRef">
                        <div v-for="element in conversations" :key="element.id">
                            <ChatItem v-model:loading="element.loading" :markdown="element.content" :role="element.role"/>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <PromptArea v-model:conversations="conversations" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.basic {
    height: 100%;
    width: 100%;
}

.outside {
    // position center
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    height: 98vh;

    // inner
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .container {
        // self
        max-width: 1200px;

        background: #3a3a3a;
        border-radius: 10px;
        border: #796868 solid 1px;

        // for inner item
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .chatArea {
            // for site
            flex-grow: 2;

            // for inner item
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            width: 100%;
            overflow-y: auto;

            .conversations {
                width: 100%;
            }
        }
    }
}

@media screen and (max-width: 480px) {
    .outside {
        height: 100%;

        .container {
            border-radius: 0;
            border: white solid 0;
        }
    }
}
</style>