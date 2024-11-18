import { Cell } from "@antv/x6"
import { Ref, computed, ref } from "vue"
import { cloneDeep, get, set } from 'lodash-es'
const styleKeys = {
    fontSize: 'attrs.label.fontSize',
    offset: 'attrs.label',
    skewX: 'attrs.label.transform',
    textDecoration: 'attrs.label.textDecoration',
    fontWeight: 'attrs.label.fontWeight'
}

type StyleProps = typeof styleKeys
export type KeyProps = keyof StyleProps
const useCellStyles = (cell: Ref<Cell>) => {
    const updateStyle = (key: KeyProps, value: any) => {
        const temp = set(cloneDeep(cell.value), styleKeys[key], value)
        cell.value.setAttrs(temp.attrs, { deep: true })
    }
    return {
        updateStyle
    }
}

export default useCellStyles