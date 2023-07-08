<script setup>
import { MarkdownToHTML } from "@/utils/MarkdownToHTML.js";
import { getLocalTime } from "@/utils/durationTime.js"
import { reactive } from "vue";
import User from '@/assets/svg/userAvatar.svg'
import assistant from '@/assets/svg/assistantAvatar.svg'

const props = defineProps({
    markdown: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        validator(value) {
            return ['user', 'system', 'assistant'].includes(value)
        }
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    }
})

defineEmits(['update:loading'])

const itemInfo = reactive({
    // for img
    avatarAlt: props.role + "'s Avatar",
    avatarSrc: props.role==="user" ? User : assistant,
    // classes
    rootClass: props.role + " chatBlock",
    // now local time
    localTime: getLocalTime(),
    // Markdown text to html
    targetHTML: () => {
        if (props.role === "assistant") {
            return MarkdownToHTML(props.markdown)
        } else if (props.role === "system") {
            return `<span><strong style="font-size: 15px">System Setting</strong><br/>${props.markdown}</span>`
        } else if (props.role === "user") {
            return MarkdownToHTML(props.markdown)
        }
    }
})
</script>

<template>
    <div :class="itemInfo.rootClass">
        <!-- todo: 待重新封装头像部分, 现在不能居中 -->
        <img :alt=itemInfo.avatarAlt :src=itemInfo.avatarSrc class="avatar"/>
        <div class="chat">
            <div class="localTime">{{ itemInfo.localTime }}</div>
            <div class="innerHtml">
                <el-skeleton animated :loading="props.loading">
                    <template #template>
                        <div style="min-width: 60vw">
                            <el-skeleton-item variant="text" style="width: 70%"/>
                            <el-skeleton-item variant="text" style="width: 100%"/>
                            <el-skeleton-item variant="text" style="width: 100%"/>
                        </div>
                    </template>
                    <template #default>
                        <div v-html="itemInfo.targetHTML()" />
                    </template>
                </el-skeleton>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// basic
.chatBlock {
    display: flex;
    max-width: 80%;

    .avatar {
        margin-top: 5px;
        border-radius: 20px;
        border: #8D9095 1px solid;
        height: 40px;
        width: 40px;
    }

    .chat {
        display: flex;
        flex-direction: column;

        .localTime {
            font-size: 12px;
            color: #8D9095;
        }

        .innerHtml {
            //font-size: 15px;
            text-align: left;
            padding: 0 12px 0 7px;
        }
    }
}

.user {
    flex-direction: row-reverse;
    margin: 15px 10px 0 auto;

    .chat {
        margin-right: 5px;

        .localTime {
            text-align: right;
        }

        .innerHtml {
            word-break: break-all; // 要求强制换行
            border: #6C6E72 2px solid;
            border-radius: 10px 2px 10px 10px;
        }
    }
}

.assistant {
    flex-direction: row;
    margin: 15px auto 0 10px;

    .chat {
        margin-left: 5px;

        .localTime {
            text-align: left;
        }

        .innerHtml {
            word-break: break-all; // 要求强制换行
            border: #6C6E72 2px solid;
            border-radius: 2px 10px 10px 10px;
        }
    }
}

.system {
    margin: 0 auto;
    padding: 7px;
    flex-direction: column;
    // 禁用系统信息显示
    display: none;

    .avatar {
        display: none;
    }

    .chat {
        .localTime {
            display: none;
        }
        .innerHtml {
            font-size: 12px;
            text-align: center;
            border-bottom: #6C6E72 2px solid;
            color: #6C6E72;
            padding: 5px 0;
        }
    }
}

</style>