import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EditorService } from '../services/editor.service';

@Directive({
  selector: '[Draggable]',
  standalone: true
})
export class DraggableDirective {

  @Input() componentType! : string;
  @Input() deletePrev!: boolean;
  @Input() componentId!: string;
  @Input() componentData: any = {};

  constructor(private element: ElementRef<HTMLElement>,
  private _editorService: EditorService){
    this.element.nativeElement.setAttribute('draggable', 'true');
  }

  @HostListener('dragstart', ['$event'])
  handleDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', this.stringifyObject());
    }
  }

  private stringifyObject(){
    return JSON.stringify({
      componentType: this.componentType,
      componentData: this.componentData,
      deletePrev: this.deletePrev,
      componentId: this.componentId
    });
  }
}
