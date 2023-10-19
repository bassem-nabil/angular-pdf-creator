import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { EditorService } from '../../services/editor.service';

@Component({
  selector: 'app-paragraph-element',
  standalone: true,
  imports: [CommonModule, NgxEditorModule, ReactiveFormsModule],
  templateUrl: './paragraph-element.component.html',
  styleUrls: ['./paragraph-element.component.scss']
})
export class ParagraphElementComponent implements OnInit {
  @Input() data: any;

  editor!: Editor;
  prevEditorContentValue: any = '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, recusandae. Alias, blanditiis corrupti et illo ea placeat voluptatibus, quas, optio vitae quae repellendus nihil necessitatibus ratione vero suscipit odio laboriosam.</p>'
  editorContent = new FormControl<any>({ value: null, disabled: false });
  toolbar = toolbarEditorDefaultConfig;

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

// colorPresets = ['red', '#FF0000', 'rgb(255, 0, 0)'];

export const toolbarEditorDefaultConfig: Toolbar = [
  ['bold', 'italic', 'underline', 'strike', 'blockquote', 'ordered_list', 'bullet_list', 'text_color', 'background_color'],
  // [],
  // ['code', ],
  // [],
  // [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  // ['link', 'image'],
  // [],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
  // ['horizontal_rule', 'format_clear']
];
