import { Directive, ElementRef, OnInit } from '@angular/core';

import * as SVG from 'svg.js';

@Directive({
  selector: '[svgJs]'
})
export class SvgJsDirective {
  private _svg: svgjs.Doc;

  constructor(private element: ElementRef) {
    console.log(this.element.nativeElement.id);
    this._svg = SVG(this.element.nativeElement);
  }

  get svg() {
    return this._svg;
  }
}
