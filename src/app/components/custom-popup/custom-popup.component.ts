import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DIALOG_TYPE } from '../../constants';
import { CustomDialogData } from '../../models/customDialogData.interface';
import { StaticAssetService } from '../../services/static-asset.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss'],
})
export class CustomPopupComponent
  extends PageObserverComponent
  implements OnInit {
  dialogType: DIALOG_TYPE;
  data?: CustomDialogData;

  constructor(
    public asset: StaticAssetService,
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    super();
    this.dialogType = this.navParams.data.dialogType;
    this.data = this.navParams.data?.data;
  }
  ngOnInit() {}

  async dismissPopup() {
    await this.modalController.dismiss();
  }
}
