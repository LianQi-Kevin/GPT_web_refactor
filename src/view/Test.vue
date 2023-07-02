<script setup>
import { reactive, ref } from "vue";
import "highlight.js/styles/monokai.css"
import ChatItem from "@/components/ChatItem.vue";

const unConvertMarkdown = "Here are some meal ideas that are orange in color:\n\n- Roasted sweet potato wedges\n- Carrot sticks with hummus\n- Butternut squash soup\n- Macaroni and cheese made with butternut squash or sweet potato puree\n- Grilled cheese sandwich with orange cheddar cheese\n- Homemade chicken nuggets made with sweet potato or carrot puree in the batter\n- Orange bell pepper slices with ranch dip\n- Pumpkin muffins or pancakes\n- Spaghetti with tomato sauce\n\nI hope this helps!"

const defaultSystemMsg = ref('You are a helpful assistant. In the following conversation, you need to provide information strictly according to the markdown syntax')

const conversations = reactive([{ id: 0, role: "system", content: defaultSystemMsg.value }])

function addNewItem(text, role) {
    conversations.push({
        id: conversations.length + 1,
        role: role,
        content: text
    })
    console.log(conversations)
}

</script>

<template>
    <div class="container">
        <div id="conversations">
            <div v-for="element in conversations" :key="element.id">
                <ChatItem :markdown="element.content" :role="element.role" />
            </div>
        </div>
        <el-button @click="addNewItem(unConvertMarkdown, 'user')" plain />
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100vw;
    background-color: #18222c;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    --subtract-height: 60px;
    max-height: calc(100vh - var(--subtract-height));
    overflow: auto;

    #conversations {
        width: 100vw;
        max-height: 95vh;
        overflow: auto;
    }
    button {
        width: 100vw;
        background-color: #535bf2;
    }
}
</style>