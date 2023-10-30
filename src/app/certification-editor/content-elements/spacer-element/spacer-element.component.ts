import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { EditorService } from '../../services/editor.service';

@Component({
  selector: 'app-spacer-element',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './spacer-element.component.html',
  styleUrls: ['./spacer-element.component.scss']
})
export class SpacerElementComponent {

  @Input() data: any;
  @Output() onDataChange = new EventEmitter<{dataKey: string, dataValue: any}>();

  values = [1,2,3,4,5];
  showOptionEl = false;
  spaceValue = new FormControl<number>(10);

  isEditMode$!: Observable<boolean>;

  constructor(
    private editorSrv: EditorService
  ) {
    this.isEditMode$ = this.editorSrv.isEditMode$;

    this.spaceValue.valueChanges.pipe(
      debounceTime(200)
    ).subscribe( val => {
      this.onDataChange.emit({dataKey: 'spaceValue', dataValue: val});
    });
  }
}
