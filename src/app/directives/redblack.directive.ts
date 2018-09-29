import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRedblack]'
})
export class RedblackDirective {

  constructor(private el: ElementRef) { 
    console.log(el);
    el.nativeElement.style.color ="red";
  }

}
