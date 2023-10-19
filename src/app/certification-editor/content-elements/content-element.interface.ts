import { DragDropObject } from "../directives/helper";
import { Grid1ColumnElementComponent, Grid2ColumnsLeftElementComponent, Grid2ColumnsRightElementComponent, Grid3ColumnsElementComponent } from "./grid-element/grid-element.component";
import { HeadingElementComponent } from "./heading-element/heading-element.component";
import { ImageElementComponent } from "./image-element/image-element.component";
import { ParagraphElementComponent } from "./paragraph-element/paragraph-element.component";
import { SpacerElementComponent } from "./spacer-element/spacer-element.component";
import { TableElementComponent } from "./table-element/table-element.component";


export interface ContentElementStyle {
  paddingTop: number;
  paddingBottom: number;
  paddingRight: number;
  paddingLeft: number;
}

export interface ContentElementData extends DragDropObject {}

export const initContentElementData : ContentElementData = {
  style: {
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  componentData: {},
  componentType: 'spacer'
}

export const componentTreeMap = {
  p: ParagraphElementComponent,
  h: HeadingElementComponent,
  layoutOneColLeft: Grid1ColumnElementComponent,
  layoutTwoColLeft: Grid2ColumnsLeftElementComponent,
  layoutTwoColRight: Grid2ColumnsRightElementComponent,
  layoutThreeCol: Grid3ColumnsElementComponent,
  img: ImageElementComponent,
  table: TableElementComponent,
  spacer: SpacerElementComponent
}
