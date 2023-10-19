import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceholderElementComponent } from '../content-elements/placeholder-element/placeholder-element.component';
import { DroppableDirective } from '../directives/droppable.directive';
import { EditorService, EditorTemplate } from '../services/editor.service';

@Component({
  selector: 'app-j-editor',
  standalone: true,
  imports: [CommonModule, PlaceholderElementComponent, DroppableDirective],
  templateUrl: './j-editor.component.html',
  styleUrls: ['./j-editor.component.scss']
})
export class JEditorComponent implements OnInit, AfterViewInit {

  isEditMode = true;
  isEmpty = true;
  @Input() template!: EditorTemplate | null;

  @ViewChild('containerRef', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;
  @ViewChild(DroppableDirective, { static: true }) droppableDirective!: DroppableDirective;

  constructor(
    private editorSrv: EditorService
  ){}

  ngOnInit(): void {
    this.editorSrv.isEditMode$.subscribe( res => this.isEditMode = res);
  }

  ngAfterViewInit(): void {
    if(this.template) {
      this.initTemplateContent();
    }
  }

  initTemplateContent() {
    if(!this.template)
      return;
    this.editorSrv.updateVariablesGroups(this.template.variables);
    this.editorSrv.setTemplateName(this.template.templateName);

    for(let elem of this.template.elements) {
      this.droppableDirective.loadComponent(elem, undefined, this.viewContainerRef);
    }
    // this.viewContainerRef.
    // this.editorSrv.addContentElement();
  }


}
