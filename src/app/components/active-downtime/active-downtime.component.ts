import { Component, OnInit } from '@angular/core';
import { StaticAssetService } from '../../services/static-asset.service';

@Component({
  selector: 'user-portal-active-downtime',
  templateUrl: './active-downtime.component.html',
  styleUrls: ['./active-downtime.component.scss'],
})
export class ActiveDowntimeComponent implements OnInit {
  constructor(public asset: StaticAssetService) {}

  ngOnInit() {}
}
