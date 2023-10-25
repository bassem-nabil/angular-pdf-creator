import { ComponentRef, EventEmitter, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { ContentElementComponent } from '../content-elements/content-element.component';
import { ContentElementData, ContentElementStyle } from '../content-elements/content-element.interface';
import { DragDropObject } from '../directives/helper';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private _isEditMode$ = new BehaviorSubject<boolean>(true);
  isEditMode$: Observable<boolean>;

  private _variableGroups$ = new BehaviorSubject<Array<{ label: string; value: string }>>([]);
  variables$: Observable<Array<{ label: string; value: string }>>;

  private _components: Array<ComponentRef<ContentElementComponent>> = [];

  private _templateName$ = new BehaviorSubject<string>('');
  templateName$: Observable<string>;

  public onPaddingSetting = new EventEmitter<ComponentRef<ContentElementComponent>>();

  constructor() {
    this.isEditMode$ = this._isEditMode$.asObservable();
    this.variables$ = this._variableGroups$.asObservable();
    this.templateName$ = this._templateName$.asObservable();
  }

  setPreviewMode() { this._isEditMode$.next(false); }
  setEditMode() { this._isEditMode$.next(true); }

  updateVariablesGroups(newVariableGroups: Array<{ label: string; value: string }>) {
    this._variableGroups$.next(newVariableGroups);
  }

  addContentElement(compRef: ComponentRef<ContentElementComponent>, index: number = -1) {
    compRef.instance.onOpenPaddingSetting.subscribe(res => {
      this.onPaddingSetting.emit(compRef)
    });

    if (index === 0)
      this._components.unshift(compRef);
    else if (index != -1)
      this._components.splice(index, 0, compRef);
    else
      this._components.push(compRef);
  }

  removeContentElement(compRef: ComponentRef<ContentElementComponent>) {
    compRef.destroy();
    this._components = this._components.filter(comp => compRef != comp);
  }

  replaceTextMatch(content: string): Observable<string> {
    return this.variables$.pipe(
      switchMap(variables => {
        let ctn = content;
        for (let vari of variables) {
          ctn = ctn.replaceAll(`#{${vari.label}}`, vari.value);
        }
        return of(ctn);
      })
    )
  }

  setTemplateName(name: string) {
    this._templateName$.next(name);
  }

  saveTemplate() {
    const editorTemplate: EditorTemplate = {
      templateName: this._templateName$.getValue(),
      variables: this._variableGroups$.getValue(),
      elements: []
    };
    for (let elem of this._components) {
      editorTemplate.elements.push(elem.instance.data);
    }
    localStorage.setItem('editorTemplate', JSON.stringify(editorTemplate));
  }

  loadTemplate(): EditorTemplate | null {
    const templateJson = localStorage.getItem('editorTemplate');
    if (!templateJson) return null;
    return JSON.parse(templateJson) as EditorTemplate;
  }

  deleteComponentById(componentId: string) {
    const compRef = this._components.find(comp => componentId === comp.instance.componentId);
    if (compRef) {
      compRef.destroy();
      this._components = this._components.filter(comp => compRef != comp);
    } else {
      console.log('cannot delete component ' + componentId, 'color: red');
    }
  }

  removeAllZ2CustomElements(renderer: Renderer2){
    const elements = document.getElementsByClassName('z2-customElement');
    for (let index = 0; index < elements.length; index++) {
      const el = elements[index];
      if (el && el.parentNode){
        renderer.removeChild(el.parentNode,el);
      }
    }
  }

  removeAllPlaceHolders(renderer: Renderer2){
    const elements = document.getElementsByTagName('app-placeholder-element');
    for (let index = 0; index < elements.length; index++) {
      const el = elements[index];
      if (el && el.parentNode){
        renderer.removeChild(el.parentNode,el);
      }
    }
  }

  removeOverLayDiv(el: HTMLElement,renderer: Renderer2) {
    const div = el.querySelector('.z2-customElement') as any;
    if (div) {
      renderer.removeChild(el,div);
    }
  }

  addOverLayDiv(el: HTMLElement,renderer: Renderer2) {
    if (!el.querySelector('.z2-customElement') as any) {
      const div = renderer.createElement('div');
      renderer.addClass(div, 'z2-customElement');
      renderer.appendChild(el, div);
    }
  }
}


export interface EditorTemplate {
  templateName: string;
  variables: Array<{ label: string; value: string }>;
  elements: Array<ContentElementData>
}
