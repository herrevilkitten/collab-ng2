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
  shape: svgjs.Shape;
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

    switch (this.canvasTools.value) {
      case 'pencil':
        this.lastNode = 'M' + x + ' ' + y;
        this.path = this.svg.svg
          .path(this.lastNode)
          .attr({
            fill: 'none',
            stroke: '#000',
            'stroke-width': 1
          });
        break;
      case 'line':
        this.shape = this.svg.svg
          .line(x, y, x, y)
          .attr({
            fill: '#000',
            stroke: '#000',
            x2: x,
            y2: y,
            originalX: x,
            originalY: y,
          });
        break;
      case 'rectangle':
        this.shape = this.svg.svg
          .rect(1, 1)
          .attr({
            fill: '#000',
            stroke: '#000',
            'stroke-width': 1,
            originalX: x,
            originalY: y,
          })
          .move(x, y);
        break;
      case 'ellipse':
        this.shape = this.svg.svg
          .ellipse(1, 1)
          .attr({
            fill: '#000',
            stroke: '#000',
            'stroke-width': 1,
            originalX: x,
            originalY: y,
          })
          .move(x, y);
        break;
    }
  }

  onMouseUp($event: MouseEvent) {
    this.mouseDown = false;
    this.path = null;
    this.shape = null;
  }

  onMove($event: MouseEvent) {
    console.log($event);
    const x = $event.offsetX;
    const y = $event.offsetY;
    let originalX;
    let originalY;
    let height;
    let width;

    if (this.mouseDown && (this.path || this.shape)) {
      switch (this.canvasTools.value) {
        case 'pencil':
          this.lastNode = 'L' + x + ' ' + y;
          this.path
            .attr({
              d: (this.path.attr('d') || '') + ' ' + this.lastNode,
              fill: 'none',
              stroke: '#000',
              'stroke-width': 1
            });
          break;
        case 'line':
          this.shape.attr({
            fill: '#000',
            stroke: '#000',
            x2: x,
            y2: y,
          });
          break;
        case 'rectangle':
          originalX = this.shape.attr('originalX');
          originalY = this.shape.attr('originalY');
          width = Math.abs(originalX - x);
          height = Math.abs(originalY - y);
          let newX = originalX;
          let newY = originalY;
          if (originalX > x) {
            newX = x;
          }
          if (originalY > y) {
            newY = y;
          }
          if (newX !== originalX || newY !== originalY) {
            this.shape.move(newX, newY);
          }
          this.shape.size(width, height);
          this.shape.attr({
            fill: '#000',
            stroke: '#000',
          });
          break;
        case 'ellipse':
          originalX = this.shape.attr('originalX');
          originalY = this.shape.attr('originalY');
          width = Math.abs(originalX - x) * 2;
          height = Math.abs(originalY - y) * 2;
          this.shape.size(width, height);
          this.shape.attr({
            fill: '#000',
            stroke: '#000',
          });
          break;
      }
    }
  }
}
