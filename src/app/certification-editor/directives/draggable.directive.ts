import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[Draggable]',
  standalone: true
})
export class DraggableDirective {

  @Input() componentType! : string;
  @Input() deletePrev!: boolean;
  @Input() componentData: any = {};

  constructor(private element: ElementRef<HTMLElement>) {
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
      deletePrev: this.deletePrev
    });
  }
}
