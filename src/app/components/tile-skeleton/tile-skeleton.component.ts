import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'user-portal-tile-skeleton',
  templateUrl: './tile-skeleton.component.html',
  styleUrls: ['./tile-skeleton.component.scss'],
})
export class TileSkeletonComponent implements OnInit {
  @Input() height = '200px';
  @Input() width = '100%';
  constructor() {}

  ngOnInit() {}
}
