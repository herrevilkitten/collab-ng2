import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdSidenav, MdButtonToggleGroup } from '@angular/material';

import { SvgJsDirective } from '../../../../directives/svg-js.directive';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CanvasComponent implements OnInit {
  @ViewChild(SvgJsDirective) svg: SvgJsDirective;
  @ViewChild('canvasSidebar') sidebar: MdSidenav;
  @ViewChild('canvasToolGroup') canvasTools: MdButtonToggleGroup;

  mouseDown = false;
  path: svgjs.Path;
  lastNode = '';

  constructor() { }

  ngOnInit() { }

  onMouseEnter($event: MouseEvent) {
    if (!$event.buttons) {
      this.mouseDown = false;
    }
  }

  onMouseDown($event: MouseEvent) {
    this.mouseDown = true;
    const x = $event.offsetX;
    const y = $event.offsetY;

    if (this.canvasTools.value === 'pencil') {
      this.lastNode = 'M' + x + ' ' + y;
      this.path = this.svg.svg
        .path(this.lastNode)
        .attr({
          fill: 'none',
          stroke: '#000',
          'stroke-width': 1
        });
    }
  }

  onMouseUp($event: MouseEvent) {
    this.mouseDown = false;
  }

  onMove($event: MouseEvent) {
    console.log($event);
    const x = $event.offsetX;
    const y = $event.offsetY;

    if (this.mouseDown) {
      if (this.canvasTools.value === 'pencil') {
        this.lastNode = 'L' + x + ' ' + y;
        this.path
          .attr({
            d: (this.path.attr('d') || '') + ' ' + this.lastNode,
            fill: 'none',
            stroke: '#000',
            'stroke-width': 1
          });
      }
    }
  }
}
