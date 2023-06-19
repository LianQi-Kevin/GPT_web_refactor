<script setup>
import { MarkdownToHTML } from "@/utils/MarkdownToHTML.js";
import { getLocalTime } from "@/utils/durationTime.js"
import { defineProps } from "vue";

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
    }
})

const avatarPath = {
    "user": "src/assets/svg/userAvatar.svg",
    "assistant": "src/assets/svg/assistantAvatar.svg"
}
//
const itemInfo = {
    // for img
    avatarAlt: props.role + "'s Avatar",
    avatarSrc: avatarPath[`${props.role}`],
    // classes
    rootClass: props.role + " chatBlock",
    // now local time
    localTime: getLocalTime(),
    // Markdown text to html
    targetHTML: () => {
        if (props.role !== "system") {
            return MarkdownToHTML(props.markdown)
        } else {
            return `<span><strong>System Setting</strong><br/>${props.markdown}</span>`
        }
    }
}
</script>

<template>
    <div :class="itemInfo.rootClass">
        <!-- todo: 待重新封装头像部分, 现在不能居中 -->
        <img :alt=itemInfo.avatarAlt :src=itemInfo.avatarSrc class="avatar"/>
        <div class="chat">
            <div class="localTime">{{ itemInfo.localTime }}</div>
            <div class="innerHtml" v-html="itemInfo.targetHTML()"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// basic
.chatBlock {
    display: flex;
    max-width: 80vw;

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
            border: #6C6E72 2px solid;
            border-radius: 2px 10px 10px 10px;
        }
    }
}

.system {
    margin: 0 auto;
    padding: 7px;
    flex-direction: column;

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