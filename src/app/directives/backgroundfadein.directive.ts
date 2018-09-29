import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import * as $ from "jquery";

@Directive({
  selector: '[addAttributeOn]'
})
export class BackgroundfadeinDirective implements OnInit {


  constructor(private element: ElementRef) {
    console.log(element);
    
   }
   @Input() myClassToAdd: string;
   @Input('addAttributeOn') elementIdToReach: string;

   ngOnInit(): void {
    
  }

  

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    const elementOffsetTop = document.getElementById('toReach').offsetTop;
    console.log(elementOffsetTop);
    
    if (elementOffsetTop <= window.pageYOffset) {
      this.element.nativeElement.classList.add(this.myClassToAdd);
    } else {
      this.element.nativeElement.classList.remove(this.myClassToAdd);
    }
  }

}
