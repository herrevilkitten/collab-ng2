import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdSidenav, MdButtonToggleGroup } from '@angular/material';

import { SvgJsDirective } from '../../../../directives/svg-js.directive';

import * as SVG from 'svg.js';

export abstract class CanvasShape {
  original: any;

  constructor(protected svg: svgjs.Doc) {

  }

  startDrawing(event: MouseEvent | TouchEvent): this { return this; }

  continueDrawing(event: MouseEvent | TouchEvent): this { return this; }

  endDrawing(event: MouseEvent | TouchEvent): this { return this; }

  protected parseMouseEvent(event: MouseEvent | TouchEvent) {
    let x;
    let y;
    if (event instanceof MouseEvent) {
      x = event.offsetX;
      y = event.offsetY;
    } else {
      const rect = (<any>event.target).getBoundingClientRect()
      x = event.targetTouches[0].pageX - rect.left;
      y = event.targetTouches[0].pageY - rect.top;
//      x = event.touches.item(0).clientX;
//      y = event.touches.item(0).clientY;
    }
    return {
      x: x,
      y: y,
    };
  }

  toJSON() {
    return JSON.stringify(this);
  }
}

export class PencilShape extends CanvasShape {
  lastNode = '';

  startDrawing(event: MouseEvent | TouchEvent) {
    const { x, y } = this.parseMouseEvent(event);
    this.lastNode = 'M' + x + ' ' + y;
    this.original = this.svg
      .path(this.lastNode)
      .attr({
        fill: 'none',
        stroke: '#000',
        'stroke-width': 1
      });
    return this;
  }

  continueDrawing(event: MouseEvent | TouchEvent) {
    const { x, y } = this.parseMouseEvent(event);
    this.lastNode = 'L' + x + ' ' + y;
    this.original
      .attr({
        d: (this.original.attr('d') || '') + ' ' + this.lastNode,
        fill: 'none',
        stroke: '#000',
        'stroke-width': 1
      });
    return this;
  }
}

export class LineShape extends CanvasShape {
  startDrawing(event: MouseEvent | TouchEvent) {
    const { x, y } = this.parseMouseEvent(event);
    this.original = this.svg
      .line(x, y, x, y)
      .attr({
        fill: '#000',
        stroke: '#000',
        x2: x,
        y2: y,
        originalX: x,
        originalY: y,
      });
    return this;
  }

  continueDrawing(event: MouseEvent | TouchEvent) {
    const { x, y } = this.parseMouseEvent(event);
    this.original.attr({
      fill: '#000',
      stroke: '#000',
      x2: x,
      y2: y,
    });
    return this;
  }
}

export class RectangleShape extends CanvasShape {
  startDrawing(event: MouseEvent | TouchEvent) {
    const { x, y } = this.parseMouseEvent(event);
    this.original = this.svg
      .rect(1, 1)
      .attr({
        fill: '#000',
        stroke: '#000',
        'stroke-width': 1,
        originalX: x,
        originalY: y,
      })
      .move(x, y);
    return this;
  }

  continueDrawing(event: MouseEvent | TouchEvent) {
    const { x, y } = this.parseMouseEvent(event);
    const originalX = this.original.attr('originalX');
    const originalY = this.original.attr('originalY');
    let width = Math.abs(originalX - x);
    let height = Math.abs(originalY - y);
    let newX = originalX;
    let newY = originalY;
    if (event.shiftKey) {
      height = width = Math.min(height, width);
      if (originalX > x) {
        newX = originalX - width;
      }
      if (originalY > y) {
        newY = originalY - height;
      }
    } else {
      if (originalX > x) {
        newX = x;
      }
      if (originalY > y) {
        newY = y;
      }
    }

    if (newX !== originalX || newY !== originalY) {
      this.original.move(newX, newY);
    }
    this.original.size(width, height);
    this.original.attr({
      fill: '#000',
      stroke: '#000',
    });
    return this;
  }
}

export class EllipseShape extends CanvasShape {
  startDrawing(event: MouseEvent | TouchEvent) {
    const { x, y } = this.parseMouseEvent(event);
    this.original = this.svg
      .ellipse(1, 1)
      .attr({
        fill: '#000',
        stroke: '#000',
        'stroke-width': 1,
        originalX: x,
        originalY: y,
      })
      .move(x, y);
    return this;
  }

  continueDrawing(event: MouseEvent | TouchEvent) {
    const { x, y } = this.parseMouseEvent(event);
    const originalX = this.original.attr('originalX');
    const originalY = this.original.attr('originalY');
    let width = Math.abs(originalX - x) * 2;
    let height = Math.abs(originalY - y) * 2;
    if (event.shiftKey) {
      height = width = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    }
    this.original.size(width, height);
    this.original.attr({
      fill: '#000',
      stroke: '#000',
    });
    return this;
  }
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CanvasComponent implements OnInit {
  @ViewChild(SvgJsDirective) svgJs: SvgJsDirective;
  @ViewChild('canvasSidebar') sidebar: MdSidenav;
  @ViewChild('canvasToolGroup') canvasTools: MdButtonToggleGroup;

  mouseDown = false;
  shape: CanvasShape = null;

  constructor() { }

  ngOnInit() {
    this.svgJs.svg.node.ondragover = (event: DragEvent) => {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      return false;
    };

    this.svgJs.svg.node.ondrop = (event: DragEvent) => {
      event.stopPropagation();
      event.preventDefault();

      const files = event.dataTransfer.files;
      if (!files.length || !files[0].type.startsWith('image/')) {
        return false;
      }
      const reader = new FileReader();
      reader.onload = (fileEvent: any) => {
        this.svgJs.svg
          .image(fileEvent.target.result)
          .move(event.offsetX, event.offsetY);
      };
      reader.readAsDataURL(files[0]);

      return false;
    };

    document.ontouchmove = (event: TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();
      return false;
    };
  }

  onMouseEnter($event: MouseEvent | TouchEvent) {
    if ($event instanceof TouchEvent || !$event.buttons) {
      this.mouseDown = false;
    }
  }

  onMouseDown($event: MouseEvent | TouchEvent | TouchEvent) {
    this.mouseDown = true;
    let x;
    let y;
    if ($event instanceof MouseEvent) {
      x = $event.offsetX;
      y = $event.offsetY;
    } else {
      x = $event.touches.item(0).clientX;
      y = $event.touches.item(0).clientY;
    }

    console.log('event we got', $event);

    if (this.shape) {
      this.shape.endDrawing($event);
    }

    switch (this.canvasTools.value) {
      case 'pencil':
        this.shape = new PencilShape(this.svgJs.svg).startDrawing($event);
        break;
      case 'line':
        this.shape = new LineShape(this.svgJs.svg).startDrawing($event);
        break;
      case 'rectangle':
        this.shape = new RectangleShape(this.svgJs.svg).startDrawing($event);
        break;
      case 'ellipse':
        this.shape = new EllipseShape(this.svgJs.svg).startDrawing($event);
        break;
    }
  }

  onMouseUp($event: MouseEvent | TouchEvent) {
    this.mouseDown = false;
    if (this.shape) {
      this.shape.endDrawing($event);
    }
    this.shape = null;
  }

  onMove($event: MouseEvent | TouchEvent) {
    if (this.mouseDown && this.shape) {
      this.shape.continueDrawing($event);
    }
  }
}
