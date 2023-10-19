import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from '../../directives/draggable.directive';
import { EditorService } from '../../services/editor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-multi-image-upload-container',
  standalone: true,
  imports: [CommonModule, DraggableDirective],
  templateUrl: './multi-image-upload-container.component.html',
  styleUrls: ['./multi-image-upload-container.component.scss']
})
export class MultiImageUploadContainerComponent {

  imageList: Array<string | ArrayBuffer> = [];
  isEditMode$: Observable<boolean>;

  constructor(
    private editorSrv: EditorService
  ) {
    this.isEditMode$ = this.editorSrv.isEditMode$;
  }

  onFileSelected(event: any): void {
    for( const file of event.target.files)
    if (file)
      this.readImage(file);

  }

  readImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageList.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

}
