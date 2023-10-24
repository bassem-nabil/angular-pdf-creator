import { ContentElementStyle, componentTreeMap } from "../content-elements/content-element.interface";

export function parseObject(objStr: string): DragDropObject {
  return JSON.parse(objStr);
}


export type DragDropObject = {
  componentType: keyof typeof componentTreeMap,
  componentData: any,
  style?: ContentElementStyle,
  deletePrev?: boolean,
  componentId?: string,
}
