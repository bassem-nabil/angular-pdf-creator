import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EditorService } from '../../services/editor.service';
import { Observable, debounceTime } from 'rxjs';

@Component({
  selector: 'app-table-element',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table-element.component.html',
  styleUrls: ['./table-element.component.scss']
})
export class TableElementComponent implements AfterViewInit, OnInit {
  @Input() data!: any;
  @ViewChild('tableRef') tableRef!: ElementRef<HTMLTableElement>;

  @Output() onDataChange = new EventEmitter<{dataKey: string, dataValue: any}>();

  matrix: Array<Array<string>> = [[]] ;
  matrixValues: Array<Array<string>> = [[]];
  get matrixHeader() {
    return this.matrix[0];
  }
  get matrixBody() {
    return this.matrix.slice(1);
  }

  prevHTML: any;

  values: Array<string> = []
  tableSize = new FormControl<string>('2x2');


  isEditMode$: Observable<boolean>;


  constructor(
    private editorSrv: EditorService
  ) {
    this.tableSize.setValue('2x2');
    this.generateMatrix();

    this.isEditMode$ = this.editorSrv.isEditMode$;

    for (let i = 1; i < 20; i++) {
      for (let j = 1; j < 20; j++) {
        this.values.push(`${i}x${j}`)
      }
    }

    this.tableSize.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(_ => this.generateMatrix());
  }


  ngOnInit(): void {
    if(this.data?.matrix) {
      this.matrix = this.data.matrix;
      this.tableSize.setValue(`${this.matrix.length}x${this.matrix[0].length}`, {emitEvent: false});
    }
  }

  ngAfterViewInit(): void {
    this.isEditMode$.subscribe(_ => {
      if (_ === false) {
        this.prevHTML = this.tableRef.nativeElement.innerHTML;
        this.editorSrv.replaceTextMatch(this.tableRef.nativeElement.innerHTML).subscribe( innerHtml => {
          this.tableRef.nativeElement.innerHTML = innerHtml;
        });
      }else {
        if(this.prevHTML != null)
        this.tableRef.nativeElement.innerHTML = this.prevHTML;
        this.prevHTML = null;
      }
    });
  }

  get rowsCount() {
    return this.matrix.length;
  }
  get colsCount() {
    return this.matrix.at(0)?.length || 0;
  }

  generateMatrix() {
    const addToArr = new Array(parseInt(this.tableSize.value!.split('x')[0])).fill('').map(
      (_, index) => this.generateColumnsArray(parseInt(this.tableSize.value!.split('x')[1]))
    );
    let prevMatrix = this.matrix;
    this.matrix = addToArr;
    // keep previous values
    for(let i=0; i < prevMatrix.length; i++){
      for(let j=0; j < prevMatrix[i].length; j++) {
        if(this.matrix.length>i && this.matrix[i].length > j)
          this.matrix[i][j] = prevMatrix[i][j];
      }
    }
    this.onDataChange.emit({dataKey: 'matrix', dataValue: this.matrix});
  }

  // handle Matrix data columns,
  generateColumnsArray(length: number, arr: Array<string> | null = null): Array<string> {
    return new Array(length).fill(0).map((_, index) => index.toString());
  }

  debounceTimeout: any;
  onContentChange(row: number, col: number, event: Event) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      this.debounceTimeout = null;
      this.matrix[row][col] = (event.target as HTMLElement).innerText;
      this.onDataChange.emit({dataKey: 'matrix', dataValue: this.matrix});
    }, 1000); //
  }
}
