import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import PageObserverComponent from '../../utils/component-observer.util';
import { useSubject } from '../../utils/useSubject';
import { IBundleDownloaderData } from '../../models';
import { StaticAssetService } from '../../services/static-asset.service';

@Component({
  selector: 'user-portal-code-push-bundle-downloader',
  templateUrl: './code-push-bundle-downloader.component.html',
  styleUrls: ['./code-push-bundle-downloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePushBundleDownloaderComponent
  extends PageObserverComponent
  implements OnInit {
  @Input() data = useSubject<IBundleDownloaderData>(null);
  _data: IBundleDownloaderData;
  percentDownloaded: number;
  downloadProgressBarValue: string;
  constructor(
    private cdr: ChangeDetectorRef,
    public asset: StaticAssetService
  ) {
    super();
  }

  ngOnInit() {
    this.observe(this.data, (val) => {
      if (!val) {
        return;
      }
      this._data = val;
      if (this._data.syncStatus === 'DOWNLOADING_PACKAGE') {
        this.percentDownloaded = Math.ceil(
          (this._data.downloadProgress.receivedBytes /
            this._data.downloadProgress.totalBytes) *
            100
        );
        this.downloadProgressBarValue = (
          this._data.downloadProgress.receivedBytes /
          this._data.downloadProgress.totalBytes
        ).toFixed(2);
      }

      this.cdr.detectChanges();
    });
  }
}
