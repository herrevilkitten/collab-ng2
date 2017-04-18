import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { CanvasComponent } from './components/canvas/canvas.component';
import { BoardListingComponent } from './components/board-listing/board-listing.component';
import { SvgJsDirective } from '../../directives/svg-js.directive';

const routes: Routes = [
  {
    path: 'boards',
    component: BoardListingComponent
  },
  {
    path: 'canvas',
    component: CanvasComponent
  },
  {
    path: '',
    redirectTo: 'boards'
  },
  {
    path: '**',
    redirectTo: 'boards'
  },
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CanvasComponent, BoardListingComponent, SvgJsDirective,
  ]
})
export class MainModule { }
