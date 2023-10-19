import { Component, ComponentRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, debounceTime } from 'rxjs';
import { EditorService } from '../services/editor.service';
import { ContentElementData, ContentElementStyle, componentTreeMap, initContentElementData } from './content-element.interface';
import { JCollapseComponent } from '../components/j-collapse/j-collapse.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DragDropObject } from '../directives/helper';
import { DraggableDirective } from '../directives/draggable.directive';
import {CdkMenu, CdkMenuItem, CdkContextMenuTrigger} from '@angular/cdk/menu';

@Component({
  selector: 'app-content-element',
  standalone: true,
  imports: [CommonModule, DraggableDirective,CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: './content-element.component.html',
  styleUrls: ['./content-element.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentElementComponent {

  @Input() data: ContentElementData = {...initContentElementData};
  @Input() insideDropZone = false;
  @ViewChild('containerRef', { static: true, read: ViewContainerRef }) containerRef!: ViewContainerRef;

  @Output() onContentDelete = new EventEmitter();
  @Output() onOpenPaddingSetting = new EventEmitter<ContentElementStyle>();

  showDeleteEl = false;
  isEditMode$!: Observable<boolean>;
  contentCompRef!: ComponentRef<any> | null;

  constructor(
    private editorSrv: EditorService
  ) {
    this.isEditMode$ = this.editorSrv.isEditMode$;
  }

  updateContent(obj: DragDropObject) {
      this.containerRef.clear();
      const compRef = this.containerRef.createComponent(componentTreeMap[obj.componentType] as any);
      (compRef.instance as any).data = obj.componentData;
      ((compRef.instance as any).onDataChange as Observable<{dataKey: string, dataValue: any}>).subscribe( res => {
        this.data.componentData[res.dataKey] = res.dataValue;
      });
      // (compRef.instance as any). = obj.componentData;
      this.data.componentType = obj.componentType;
      this.data.componentData = obj.componentData;
      if(obj.style)
        this.data.style = obj.style;
      // compRef.instance.data = componentData;
      this.containerRef.insert(compRef.hostView);
      this.contentCompRef = compRef;
  }

  removeContent() {
    this.containerRef.clear();
    this.contentCompRef = null;
    this.onContentDelete.emit();
  }

  openPaddingSetting() {
    this.onOpenPaddingSetting.emit(this.data.style);
  }
}




@Component({
  selector: 'app-content-element-container-config',
  standalone: true,
  imports: [CommonModule, JCollapseComponent, ReactiveFormsModule],
  template: `
    <j-collapse headerName="Paddings">
      <form class="inp-grid" [formGroup]="styleForm">
        <div>
          <label>Top</label>
          <input type="number" placeholder="Top" formControlName="paddingTop" />
        </div>
        <div>
          <label>Bottom</label>
          <input type="number" placeholder="Bottom" formControlName="paddingBottom"/>
        </div>
        <div>
          <label>Left</label>
          <input type="number" placeholder="Left" formControlName="paddingLeft"/>
        </div>
        <div>
          <label>Right</label>
          <input type="number" placeholder="Right" formControlName="paddingRight"/>
        </div>
      </form>
    </j-collapse>
  `,
  styles: [
    `.inp-grid {
      display:grid;
      grid-template-columns: 1fr 1fr;
      max-width: 100%;
      gap: 10px;
      background:#C9D1DA;
      padding:10px;
      border-radius: 7px;
    }`,
    `input {
      max-width: 100%;
      width: 100%;
      border-radius: 6px;
      border: 1px solid #DBDBDB;
      background: #FFF;
      box-shadow: 1px 2px 0px 0px rgba(0, 0, 0, 0.03);
      height: 35px;
      outline: none;
      color: #393939;
      font-size: 14px;
      font-weight: 400;
      padding: 0px 5px;
      margin-top:5px;
    }`
  ]
})
export class ContentElementContainerConfigComponent implements OnChanges {
  @Input() values!: ContentElementStyle;
  @Input('content-element') contentElement!: ComponentRef<ContentElementComponent>;
  styleForm = new FormGroup({
    paddingTop: new FormControl<number>(0),
    paddingBottom: new FormControl<number>(0),
    paddingLeft: new FormControl<number>(0),
    paddingRight: new FormControl<number>(0),
  })

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['contentElement']) {
      this.styleForm.patchValue({...changes['contentElement'].currentValue?.instance?.data?.style});
    }
  }

  ngOnInit(): void {
    this.styleForm.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe( _ => {
      if(this.contentElement)
      this.contentElement.instance.data.style = this.styleForm.value as ContentElementStyle;
    });
  }

}
