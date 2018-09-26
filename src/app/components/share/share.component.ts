import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  share_title: string;
  share_text: string;
  share_url; string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.share_title = this.route.snapshot.params["name"];
    this.share_text = this.route.snapshot.params["description"];
    this.share_url = this.route.snapshot.params["link"];

  }

}
