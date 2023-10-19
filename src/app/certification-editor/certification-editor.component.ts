import { Component, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JCollapseComponent } from './components/j-collapse/j-collapse.component';
import { JEditorComponent } from './j-editor/j-editor.component';
import { DraggableDirective } from './directives/draggable.directive';
import { MultiImageUploadContainerComponent } from './components/multi-image-upload-container/multi-image-upload-container.component';
import { jsPDF } from 'jspdf';
import { VariablesContainerComponent } from './components/variables-container/variables-container.component';
import { EditorService, EditorTemplate } from './services/editor.service';
import { ContentElementComponent, ContentElementContainerConfigComponent } from './content-elements/content-element.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-certification-editor',
  standalone: true,
  imports: [CommonModule, JCollapseComponent, JEditorComponent, DraggableDirective, MultiImageUploadContainerComponent, VariablesContainerComponent, ContentElementContainerConfigComponent, ReactiveFormsModule],
  templateUrl: './certification-editor.component.html',
  styleUrls: ['./certification-editor.component.scss']
})
export class CertificationEditorComponent {

  isEditMode = true;
  templateName = new FormControl<string>('');
  currentSetting!: ComponentRef<ContentElementComponent>;

  editorTemplate: EditorTemplate | null = null;

  constructor(
    private editorSrv: EditorService
  ) {
    this.editorSrv.onPaddingSetting.subscribe( _ => this.currentSetting = _);
    this.editorSrv.templateName$.subscribe( _ => this.templateName.setValue(_, {emitEvent: false}));

    this.templateName.valueChanges.pipe(
      debounceTime(100)
    ).subscribe( _ => this.editorSrv.setTemplateName(_!));

    this.editorTemplate = this.editorSrv.loadTemplate();
  }

  deleteTemplate() {
    alert("DELETE FN");
  }

  saveTemplate() {
    this.editorSrv.saveTemplate();
  }

  updateMode() {
    if(this.isEditMode) {
      this.isEditMode = false;
      this.editorSrv.setPreviewMode();
      return;
    }
    this.isEditMode = true;
    this.editorSrv.setEditMode();
  }

  generatePDF() {
      var pdf = new jsPDF('p', 'px', 'a4');
      const tempName = this.templateName.value != '' ? this.templateName.value : 'default-name';
      document.getElementById('ngxPrintId')!.style.transform = 'scale(.5) translate(-50%, -50%)';
      pdf.html(document.getElementById('ngxPrintId')!, {
        callback: function (pdf) {
          pdf.save(`${tempName}.pdf`);
          document.getElementById('ngxPrintId')!.style.transform = 'none';
        }
      });
  }

}
