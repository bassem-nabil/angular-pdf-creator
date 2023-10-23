import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorModule, Toolbar, toHTML } from 'ngx-editor';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { EditorService } from '../../services/editor.service';

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
  prevEditorContentValue: any = "<h1>HEADING</h1>";
  editorContent = new FormControl<any>({ value: null, disabled: false });
  toolbar = headingToolbarEditorDefaultConfig;

  isEditMode$!: Observable<boolean>;

  @Output() onDataChange = new EventEmitter<{dataKey: string, dataValue: any}>();


  constructor(
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
