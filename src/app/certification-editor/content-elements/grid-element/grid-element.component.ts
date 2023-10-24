import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DroppableZoneDirective } from '../../directives/droppable-zone.directive';
import { ContentElementData } from '../content-element.interface';
import { EditorService } from '../../services/editor.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-grid-1-columns-left-element',
  standalone: true,
  imports: [CommonModule, DroppableZoneDirective],
  template: `
  <div class="j-grid-element" [ngClass]="{'min-p': (isEditMode$ | async)}">
    <div class="droppable-item" DroppableZone [gridType]="'Grid1Column'" [gridZone]="'middle'">
      Drop Content Here
    </div>
  </div>
  `,
  styles: [
    `.j-grid-element {
        display: grid;
        grid-template-columns: 1fr;
        gap: 100px;
        background:#fff;
    }`,
    `.min-p {
      // padding:17px;
    }`,
    `.j-grid-element .droppable-item {
        width: 100%;
        padding: 20px;
        border: 1px dashed #2C363A;
        background: #F0F4F6;
        // border-radius: 7px;
        text-align: center;
        color:#333;
        font-size: 13px;
    }`
  ]
})
export class Grid1ColumnElementComponent implements AfterViewInit {
  @Output() onDataChange = new EventEmitter<{dataKey: string, dataValue: any}>();
  @ViewChildren(DroppableZoneDirective) droppableZoneDirective!: QueryList<DroppableZoneDirective>;


  @Input() data: any = {
    left: null,
    right: null
  };

  isEditMode$: Observable<boolean>;

  constructor(
    private editorSrv: EditorService
  ) {
    this.isEditMode$ = this.editorSrv.isEditMode$;
  }

  ngAfterViewInit(): void {
    setTimeout( () =>{
      if(this.data && this.data.middle) {
        this.droppableZoneDirective.get(0)!.loadComponent(this.data.middle as ContentElementData);
      }
    },0);
  }
}

@Component({
  selector: 'app-grid-2-columns-left-element',
  standalone: true,
  imports: [CommonModule, DroppableZoneDirective],
  template: `
  <div class="j-grid-element" [ngClass]="{'min-p': (isEditMode$ | async)}">
    <div class="droppable-item" DroppableZone [gridType]="'Grid2ColumnsLeft'" [gridZone]="'left'">
      Drop Content Here
    </div>
    <div class="droppable-item" DroppableZone [gridType]="'Grid2ColumnsLeft'" [gridZone]="'right'">
      Drop Content Here
    </div>
  </div>
  `,
  styles: [
    `.j-grid-element {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 18px;
        background:#fff;
    }`,
    `.min-p {
      // padding:17px;
    }`,
    `.j-grid-element .droppable-item {
        width: 100%;
        padding: 20px;
        border: 1px dashed #2C363A;
        background: #F0F4F6;
        // border-radius: 7px;
        text-align: center;
        color:#333;
        font-size: 13px;
    }`
  ]
})
export class Grid2ColumnsLeftElementComponent implements AfterViewInit {
  @Output() onDataChange = new EventEmitter<{dataKey: string, dataValue: any}>();
  @ViewChildren(DroppableZoneDirective) droppableZoneDirective!: QueryList<DroppableZoneDirective>;


  @Input() data: any = {
    left: null,
    right: null
  };

  isEditMode$: Observable<boolean>;

  constructor(
    private editorSrv: EditorService
  ) {
    this.isEditMode$ = this.editorSrv.isEditMode$;
  }

  ngAfterViewInit(): void {
    setTimeout( () =>{
      if(this.data && this.data.left) {
        this.droppableZoneDirective.get(0)!.loadComponent(this.data.left as ContentElementData);
      }
      if(this.data && this.data.right) {
        this.droppableZoneDirective.get(1)!.loadComponent(this.data.right as ContentElementData);
      }
    },0);
  }
}



@Component({
  selector: 'app-grid-2-columns-right-element',
  standalone: true,
  imports: [CommonModule, DroppableZoneDirective],
  template: `
  <div class="j-grid-element" [ngClass]="{'min-p': (isEditMode$ | async)}">
    <div class="droppable-item" DroppableZone [gridType]="'Grid2ColumnsRight'" [gridZone]="'left'">
      Drop Content Here
    </div>
    <div class="droppable-item" DroppableZone [gridType]="'Grid2ColumnsRight'" [gridZone]="'right'">
      Drop Content Here
    </div>
  </div>
  `,
  styles: [
    `.j-grid-element {
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 18px;
        /* padding:20px; */
        background:#fff;
    }`,
    `.min-p {
      // padding:17px;
    }`,
    `.j-grid-element .droppable-item {
        width: 100%;
        padding: 20px;
        border: 1px dashed #2C363A;
        background: #F0F4F6;
        // border-radius: 7px;
        text-align: center;
        color:#333;
        font-size: 13px;
    }`
  ]
})
export class Grid2ColumnsRightElementComponent implements AfterViewInit {
  @Output() onDataChange = new EventEmitter<{dataKey: string, dataValue: any}>();
  @ViewChildren(DroppableZoneDirective) droppableZoneDirective!: QueryList<DroppableZoneDirective>;


  @Input() data: any = {
    left: null,
    right: null
  };

  isEditMode$: Observable<boolean>;

  constructor(
    private editorSrv: EditorService
  ) {
    this.isEditMode$ = this.editorSrv.isEditMode$;
  }

  ngAfterViewInit(): void {
    setTimeout( () =>{
      if(this.data && this.data.left) {
        this.droppableZoneDirective.get(0)!.loadComponent(this.data.left as ContentElementData);
      }
      if(this.data && this.data.right) {
        this.droppableZoneDirective.get(1)!.loadComponent(this.data.right as ContentElementData);
      }
    },0);
  }
}



@Component({
  selector: 'app-grid-3-columns-element',
  standalone: true,
  styleUrls: ['grid-element.component.scss'],
  imports: [CommonModule, DroppableZoneDirective],
  template: `

  <div class="j-grid-element" [ngClass]="{'min-p': (isEditMode$ | async)}">
    <div class="droppable-item" DroppableZone [gridType]="'Grid3Columns'" [gridZone]="'left'">
      Drop Content Here
    </div>
    <div class="droppable-item" DroppableZone [gridType]="'Grid3Columns'" [gridZone]="'middle'">
      Drop Content Here
    </div>
    <div class="droppable-item" DroppableZone [gridType]="'Grid3Columns'" [gridZone]="'left'">
      Drop Content Here
    </div>
  </div>
  `,
  styles: [
    `.j-grid-element {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 18px;
        background:#fff;
    }`,
    `.min-p {
      // padding:17px;
    }`,
    `.j-grid-element .droppable-item {
        width: 100%;
        padding: 20px;
        border: 1px dashed #2C363A;
        background: #F0F4F6;
        // border-radius: 7px;
        text-align: center;
        color:#333;
        font-size: 13px;
    }`
  ]
})
export class Grid3ColumnsElementComponent implements AfterViewInit  {
  @Output() onDataChange = new EventEmitter<{dataKey: string, dataValue: any}>();
  @ViewChildren(DroppableZoneDirective) droppableZoneDirective!: QueryList<DroppableZoneDirective>;

  @Input() data: any = {
    left: null,
    middle: null,
    right: null
  };

  isEditMode$: Observable<boolean>;

  constructor(
    private editorSrv: EditorService
  ) {
    this.isEditMode$ = this.editorSrv.isEditMode$;
  }

  ngAfterViewInit(): void {
    setTimeout( () =>{
      if(this.data && this.data.left) {
        this.droppableZoneDirective.get(0)!.loadComponent(this.data.left as ContentElementData);
      }
      if(this.data && this.data.middle) {
        this.droppableZoneDirective.get(1)!.loadComponent(this.data.middle as ContentElementData);
      }
      if(this.data && this.data.right) {
        this.droppableZoneDirective.get(2)!.loadComponent(this.data.right as ContentElementData);
      }
    },0);
  }
}

