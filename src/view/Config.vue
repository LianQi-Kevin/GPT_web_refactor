<script setup>
import ThemeSwitch from "@/components/ThemeSwitch.vue";
import {ref, reactive} from "vue";
import {Delete, Refresh} from "@element-plus/icons-vue";

const unsetURL = ref('')

const chatGLMConfig = reactive({
    // todo: 待添加onMounted获取默认值
    URLS: []
})

const deleteRow = (index) => {
    // 删除URL
    chatGLMConfig.URLS.splice(index, 1)
}

// 模型设置
const infoForm = reactive({
    "model": 'gpt-3.5-turbo',
    "temperature": 0.95,
    "top_p": 0.7,
    "max_response_tokens": 2048,
})

</script>

<template>
    <div class="container">
        <el-page-header style="width: 98%; margin: 5px 20px" >
            <template #extra>
                <ThemeSwitch/>
            </template>
        </el-page-header>
        <el-tabs type="border-card" >
            <el-tab-pane label="ChatGLM" name="first">
                <div class="URLConfigs">
                    <h3 style="text-align: left">1. ChatGLM URLs Configs</h3>
                    <div class="addURL">
                        <el-text style="min-width: 100px">Add URL:</el-text>
                        <el-input placeholder="请输入ChatGLM后端地址" v-model="unsetURL" clearable>
                            <template #append>
                                <el-button @click='chatGLMConfig.URLS.push({URL: unsetURL, Status: "unknown"})'
                                >Add</el-button>
                            </template>
                        </el-input>
                    </div>
                    <el-table :data="chatGLMConfig.URLS" style="width: 100%; margin: 10px 0" border>
                        <el-table-column type="index" :index="(index) => {return index}" />
                        <el-table-column prop="URL" label="URL"/>
                        <el-table-column prop="Status" label="Status"/>
                        <el-table-column fixed="right" label="Action" width="120">
                            <template #default="scope">
                                <el-button-group>
                                    <el-button @click.prevent="console.log('Refresh URL')" :icon="Refresh" />
                                    <el-button @click.prevent="deleteRow(scope.$index)" :icon="Delete" />
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button-group style="width: 100%">
                        <el-button size="large" style="width: 50%">refresh all urls</el-button>
                        <el-button size="large" style="width: 50%">Delete all urls</el-button>
                    </el-button-group>
                </div>

                <el-divider />
                <div class="modelParameters">
                    <h3 style="text-align: left">2. Model Default Parameters</h3>
                    <el-form :model="infoForm" label-position="top" :inline="true">
                        <el-form-item label="Temperature">
                            <el-slider v-model="infoForm.temperature" :min="0" :max="2" :step="0.1"/>
                        </el-form-item>
                        <el-form-item label="Top-p">
                            <el-slider v-model="infoForm.top_p" :min="0" :max="2" :step="0.1" />
                        </el-form-item>
                        <el-form-item label="Max Response Tokens">
                            <el-input-number v-model="infoForm.max_response_tokens" :min="500" :max="4000"/>
                        </el-form-item>
                    </el-form>
                </div>

                <el-divider />
                <el-button size="large" style="width: 100%">Submit</el-button>

            </el-tab-pane>
            <el-tab-pane label="AI with Art" name="second">
                Un Setting
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    .el-tabs {
        width: 98%;
        flex-grow: 1;
        .URLConfigs {
            .addURL {
                display: flex;
                flex-direction: row;
            }
        }

        .modelParameters {
            justify-content: center;
            .el-form-item {
                min-width: 150px;
                flex-basis: 200px;
                flex-grow: 2;
            }
        }
    }
}
</style>