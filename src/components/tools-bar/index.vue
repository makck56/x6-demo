<template>
    <div class="tools-wrapper">
        <div class="tool-item">
            <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                    文本
                    <!-- <DownOutlined /> -->
                </a>
                <template #overlay>
                    <a-menu :items="textItems" @click="({ key }: SelectInfo) => {
                        changeMenuItem('fontSize', key)
                    }"></a-menu>
                </template>
            </a-dropdown>
        </div>
        <div class="tool-item">
            <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                    文本位置
                    <!-- <DownOutlined /> -->
                </a>
                <template #overlay>
                    <a-menu :items="textPosItems" @click="({ key }: SelectInfo) => {
                        changeMenuItem('offset', key)
                    }"></a-menu>
                </template>
            </a-dropdown>
        </div>
        <div class="tool-item" @click=" changeMenuItem('fontWeight', 'bold')">加粗</div>
        <div class="tool-item" @click=" changeMenuItem('textDecoration', 'underline')">下划线</div>
    </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
// import { DownOutlined } from '@ant-design/icons-vue';
import { Cell } from '@antv/x6';
import useCellStyles, {
    KeyProps
} from '../../hooks/useCellStyles';
import { SelectInfo } from 'ant-design-vue/es/menu/src/interface';
import { message } from 'ant-design-vue';

const cell = defineModel("cell", { type: Cell || undefined, default: undefined })

const { updateStyle } = useCellStyles(cell)
const textItems = ref([
    {
        key: 10,
        label: '10px'
    },
    {
        key: 14,
        label: '14px',
    },
    {
        key: 16,
        label: '16px',
    },
    {
        key: 24,
        label: '24px',
    },
    {
        key: 48,
        label: '48px',
    },
])

const textPosItems = ref([
    {
        key: 'lt',
        label: '左上角'
    },
    {
        key: 'lc',
        label: '左中间'
    },
    {
        key: 'lb',
        label: '左下角'
    },
    {
        key: 'rt',
        label: '右上角'
    },
    {
        key: 'rc',
        label: '右中间'
    },
    {
        key: 'rb',
        label: '右下角'
    },
])
const offsetValue = {
    'lt': {
        refX: '-100%',
        refY: '0',
        refY2: '-50%'
    },
    'lc': {
        refX: '-100%',
        refY: '50%',
        refY2: '-25%'
    },
    'lb': {
        refX: '-100%',
        refY: '100%',
        refY2: '25%',
    },
    'rt': {
        refX: '100%',
        refY: '0%',
        refY2: '-50%'
    },
    'rc': {
        refX: '100%',
        refY: '50%',
        refY2: '-25%'
    },
    'rb': {
        refX: '100%',
        refY: '100%',
        refY2: '25%',
    }
}

const changeMenuItem = (styleKey: KeyProps, value: SelectInfo['key']) => {
    if (cell.value == null) {
        message.warning('请选择元素！')
        return
    }
    switch (styleKey) {
        case 'fontSize':   
        case 'fontWeight':
        case 'textDecoration':
            updateStyle(styleKey, value)
            break;
        case 'offset': 
            updateStyle(styleKey, offsetValue[value])
            break;
        default:
            break;
    }

}
</script>
<style lang='less'>
.tools-wrapper {
    @apply w-full h-10 bg-white shadow-xl absolute top-4 left-0 z-10 flex items-center px-4 text-black;
    .tool-item {
        @apply ~'w-[80px]' mr-4 border border-solid border-black;
    }
}
</style>