import { TracksComponent } from './../tracks/tracks.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {
  selectedGenre: string;
  @ViewChild(TracksComponent) child: any;
  constructor() { }

  ngOnInit() {
  }

  doTopGenre() {
    this.child.getTrendingGenre(this.selectedGenre);
  }

}
