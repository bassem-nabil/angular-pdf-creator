import { ComponentRef, Directive, Host, HostListener, Input, ViewContainerRef} from '@angular/core';
import { JEditorComponent } from '../j-editor/j-editor.component';
import { PlaceholderElementComponent } from '../content-elements/placeholder-element/placeholder-element.component';
import { componentTreeMap } from '../content-elements/content-element.interface';
import { DragDropObject, parseObject } from './helper';
import { ContentElementComponent } from '../content-elements/content-element.component';
import { EditorService } from '../services/editor.service';

@Directive({
  selector: '[Droppable]',
  standalone: true
})
export class DroppableDirective {

  @Input() containerRef!: ViewContainerRef;

  isEntered: boolean = false;
  componentRefs: Array<ComponentRef<any>> = [];
  placeHolderRef!: ComponentRef<PlaceholderElementComponent>;
  placeHolderIndex = -1;

  constructor(
    @Host() private hostComp: JEditorComponent,
    private editorSrv: EditorService
  ) { }

  loadComponent(obj: DragDropObject, index: number | undefined = undefined, contRef: ViewContainerRef|undefined = undefined) {

    const containerRef = contRef ? contRef : this.containerRef;
    const contentElementRef = containerRef.createComponent(ContentElementComponent);

    contentElementRef.instance.updateContent(obj);
    contentElementRef.instance.onContentDelete.subscribe( _ => {
      this.editorSrv.removeContentElement(contentElementRef);
    });

    this.editorSrv.addContentElement(contentElementRef);

    containerRef.insert(contentElementRef.hostView, index);
    if(index === 0)
      this.componentRefs.unshift(contentElementRef);
    else if (index)
      this.componentRefs.splice(index, 0, contentElementRef);
    else
      this.componentRefs.push(contentElementRef);

    // update x-index
    for(let i=0; i<this.componentRefs.length; i++) {
      (this.componentRefs[i].location.nativeElement as HTMLElement).setAttribute('x-index', i.toString());
    }
    (contentElementRef.location.nativeElement as HTMLElement).addEventListener('dragenter', () => {
      this.isEntered = true;
      containerRef.move(this.placeHolderRef.hostView, parseInt((contentElementRef.location.nativeElement as HTMLElement).getAttribute('x-index')!));
      this.placeHolderIndex = parseInt((contentElementRef.location.nativeElement as HTMLElement).getAttribute('x-index')!);
    } );
    (contentElementRef.location.nativeElement as HTMLElement).addEventListener('dragleave', () => {
      this.isEntered = false;
    });
    this.placeHolderIndex = -1;
    this.hostComp.isEmpty = false;
  }

  loadPlaceHolder(){
    if(this.placeHolderRef && this.placeHolderIndex === -1){
      this.containerRef.insert(this.placeHolderRef.hostView, this.containerRef.length)
      this.placeHolderIndex = this.containerRef.length-1;
      return;
    }
    if(this.placeHolderRef) {
      this.containerRef.move(this.placeHolderRef.hostView, this.containerRef.length-1);
      this.placeHolderIndex = this.containerRef.length-1;
      return;
    }

    this.placeHolderRef = this.containerRef.createComponent(PlaceholderElementComponent);
    this.containerRef.insert(this.placeHolderRef.hostView);
    this.placeHolderIndex = 0;
  }

  @HostListener('dragover', ['$event'])
  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event'])
  handleDragEnter(event: DragEvent) {
    if(this.isDropZone(event.target as HTMLElement)) {
      this.containerRef.detach(this.placeHolderIndex);
    }
    if(!this.isEntered){
      this.loadPlaceHolder();
    }
  }

  private isDropZone(element: HTMLElement) {
    return element.hasAttribute('droppablezone');
  }

  @HostListener('dragleave', ['$event'])
  handleDragLeave(event: DragEvent) {
    if(this.isEntered){
      return;
    }
    this.isEntered = false;
  }

  @HostListener('drop', ['$event'])
  handleDrop(event: DragEvent) {
    if(this.isDropZone(event.target as HTMLElement)) {
      this.placeHolderIndex = -1;
      return;
    }

    event.stopPropagation();
    this.containerRef.detach(this.placeHolderIndex);
    const obj = parseObject(event.dataTransfer!.getData('text/plain'));
    this.loadComponent(obj, this.placeHolderIndex);
    return false;
  }


}
