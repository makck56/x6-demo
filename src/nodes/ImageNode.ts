import { Graph } from "@antv/x6";
import anquanSvg from "../images/anquan.svg";
import baocunSvg from "../images/baocun.svg";
import { isArray, mergeWith } from "lodash-es";
function customizer(objValue:any, srcValue:any) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export const baseCustomImageNodeOptions = {
  width: 50,
  height: 50,
  attrs: {
    image: {
      "xlink:href": anquanSvg,
      refWidth: "100%",
      refHeight: "100%",
    },
    label: {
      refWidth: "100%",
      refHeight: "100%",
    },
  },
  markup: [
    {
      tagName: "image",
      selector: "image",
    },
    {
      tagName: "text",
      selector: "label",
    }
  ],
}
/**
 * @description: 创建自定义图表， 在baseCustomImageNodeOptions合并options，创建对应的图标类型
 * @param {Node} options
 * @return {*}
 */
export const registerCustomImageNode = (shapeName: string, options: any) => {
  const node = mergeWith({}, baseCustomImageNodeOptions, options, customizer) as any
  Graph.registerNode(shapeName, node);
}

// 注册图标
registerCustomImageNode('custom-anquan', {
  width: 100,
  height: 100,
  attrs: {
    image: {
      "xlink:href": baocunSvg,
    }
  },
  markup: [
    {
      tagName: "rect",
      selector: "border",
    },
  ],
})

/**
 * // TODO
 * 1. 自动化注册图标类型（后台模式）
 * 2. 
 */