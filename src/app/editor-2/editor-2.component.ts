import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-editor-2',
  standalone: true,
  imports: [CommonModule, NgxEditorModule, ReactiveFormsModule],

  template: `<ngx-editor
    [editor]="editor"
    [formControl]="editorContent"
    style="width: 100%; height: 500px; border: 1px solid #ccc;"
  >
  </ngx-editor> `,
})
export class Editor2Component implements OnInit {
  editor!: Editor;
  editorContent = new FormControl({ value: '', disabled: false });

  constructor() {}

  ngOnInit(): void {
    this.editor = new Editor({ inputRules: true });
  }
}
