import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  Renderer2
} from "@angular/core";
import { IParallaxScrollConfig } from "ng2-parallaxscroll";
import * as $ from "jquery";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { ViewportScroller } from "@angular/common";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  config: IParallaxScrollConfig = {
    axis: "Y",
    speed: -0.5
  };
  @ViewChild("place1")
  private end: ElementRef;
  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private router: Router,
    private render: Renderer2
  ) {}

  onElementScroll($event) {
    console.log($event);
  }
  ngOnInit() {
    console.log("before logged in");
    // this.render.listen('window', 'scroll', ()=> {
    //   console.log('scroll')
    //   console.log(window.scrollY);
    // });

    this.getAttention("bounce", 75, 30, 1);
    var jumboHeight = $(".jumbotron").outerHeight();
    function parallax() {
      var scrolled = $("#scrollMe").scrollTop();
      $(".bg").css("height", jumboHeight - scrolled + "px");
    }

    $("#scrollMe").scroll(function(e) {
      parallax();
    });

    $("#scrollMe").scroll(function(e) {
      const elementOffsetTop = $("#about").outerHeight();
      const pageYOffset = $("#scrollMe").scrollTop();
      console.log("elementOffsetTop " + elementOffsetTop);
      console.log("pageYOffset " + pageYOffset);

      if (pageYOffset + 50 >= elementOffsetTop) {
        $("nav").addClass("background");
        $(".nav-bar-add").animate({ opacity: 1 }, 1000);
      } else {
        $("nav").removeClass("background");
      }

      if (pageYOffset + 150 >= elementOffsetTop) {
        $(".nav-bar-add").animate({ opacity: 1 }, {duration: 1000, queue: false}).animate({ 'margin-top': 100 }, {duration: 1000, queue: false});
      }else {
        
      }


    });
  }

  @HostListener("window:scroll", [])
  onScrollEvent($event) {
    console.log("scrolling");
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    console.log("scrolling");
  }

  @HostListener("scroll")
  public asd(): void {
    console.log("scrolling");
  }

  getAttention(elementClass, initialDistance, times, damping) {
    for (var i = 1; i <= times; i++) {
      var an = (Math.pow(-1, i) * initialDistance) / (i * damping);
      $("." + elementClass).animate({ top: an }, 100);
    }
    $("." + elementClass).animate({ top: 0 }, 100);
  }

  scrollTop() {
    var div = this.el.nativeElement.querySelector("#jumbotron");
    // div.scrollIntoView({ behavior: 'smooth' });
    $("#scrollMe").animate({ scrollTop: 0 }, 1500);
    this.getAttention("bounce", 75, 30, 1);
  }

  scrollBottom() {
    console.log(this.end);
    var div = this.el.nativeElement.querySelector("#place1");
    console.log(div);
    // div.scrollIntoView({ behavior: 'smooth' });
    $("#scrollMe").animate({ scrollTop: $(document).height() }, 1500);
    this.getAttention("bounce2", 75, 30, 1);
  }
}
