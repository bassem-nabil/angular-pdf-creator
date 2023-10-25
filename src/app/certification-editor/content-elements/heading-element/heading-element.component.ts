import { Component, EventEmitter, HostListener, Input, Output,ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorModule, Toolbar, toHTML } from 'ngx-editor';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { EditorService } from '../../services/editor.service';
import { AnimationMetadata, style, animate, AnimationBuilder } from '@angular/animations';

@Component({
  selector: 'app-heading-element',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './heading-element.component.html',
  styleUrls: ['./heading-element.component.scss']
})
export class HeadingElementComponent {

  @Input() data: any;

  showEditors = false;
  editor!: Editor;
  dragEvent: any = null;
  prevEditorContentValue: any = "<h1>HEADING</h1>";
  editorContent = new FormControl<any>({ value: null, disabled: false });
  toolbar = headingToolbarEditorDefaultConfig;
  isEditMode$!: Observable<boolean>;

  @Output() onDataChange = new EventEmitter<{dataKey: string, dataValue: any}>();

  @HostListener('dragenter', ['$event'])
  handleDragEnter(event: DragEvent) {
    this.dragEvent = event.target;
    const el = this.element.nativeElement;
    if (el) {
      this.editorSrv.addOverLayDiv(el,this.renderer);
    }
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event'])
  handleDragLeave(event: DragEvent) {
    if (this.dragEvent === event.target) {
      const el = this.element.nativeElement;
      if (el) {
        this.editorSrv.removeOverLayDiv(el,this.renderer);
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  constructor(
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>,
    private editorSrv: EditorService
  ) {
    this.isEditMode$ = this.editorSrv.isEditMode$;
    this.isEditMode$.subscribe(res => {
      if (res) {
        this.editorContent.enable();
        this.editorContent.setValue(this.prevEditorContentValue);
      } else {
        this.prevEditorContentValue = this.editorContent.value;
        this.editorContent.disable();
        this.editorSrv.replaceTextMatch(this.prevEditorContentValue).subscribe( val => {
          this.editorContent.setValue(val);
        })
      }
    });
  }


  ngOnInit(): void {
    this.editor = new Editor({
      history: true,
      keyboardShortcuts: true,
      inputRules: true,
    });

    if(this.data?.htmlContent) {
      this.editorContent.setValue(this.data?.htmlContent);
    }

    this.editorContent.valueChanges.pipe(
      debounceTime(200)
    ).subscribe( val => {
      this.onDataChange.emit({dataKey: 'htmlContent', dataValue: val});
    });
  }
}

export const headingToolbarEditorDefaultConfig: Toolbar = [
  ['italic', 'underline', 'text_color'],
  // [],
  // ['code', ],
  // [],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  // ['link', 'image'],
  // [],
  ['align_left', 'align_center', 'align_right'],
  // ['horizontal_rule', 'format_clear']
];
