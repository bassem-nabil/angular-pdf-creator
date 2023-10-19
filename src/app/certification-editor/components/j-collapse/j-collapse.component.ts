import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'j-collapse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './j-collapse.component.html',
  styleUrls: ['./j-collapse.component.scss'],
  animations: [
    trigger('heightAnimation', [
      state('expanded',
        style({height: '*'})
      ),
      state('collapsed',
        style({height: '0px'})
      ),
      transition('expanded <=> collapsed', [animate('0.2s ease-in-out')]),
    ]),
    trigger('dropIconAnimation', [
      state('expanded',
        style({rotate: '180deg'})
      ),
      state('collapsed',
        style({rotate: '0deg'})
      ),
      transition('expanded <=> collapsed', [animate('0.2s ease-in-out')]),
    ])
  ],
})
export class JCollapseComponent {
  @Input() headerName: string = '';
  animationState: 'expanded' | 'collapsed' = 'expanded';
  duration: number = 500;

  toggle() {
    this.animationState =
      this.animationState === 'expanded' ? 'collapsed' : 'expanded';
  }


}
