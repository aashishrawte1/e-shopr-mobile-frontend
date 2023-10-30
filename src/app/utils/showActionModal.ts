import { ModalController } from '@ionic/angular';
import { modalLeaveAnimation } from '../animations/modal-leave.animation';
import { CustomPopupComponent } from '../components/custom-popup/custom-popup.component';
import { DIALOG_TYPE } from '../constants';
import { CustomDialogData } from '../models/customDialogData.interface';

export const showActionModal = async (
  modalController: ModalController,
  action: DIALOG_TYPE,
  data?: CustomDialogData
) => {
  const dialogType = action;

  const componentProps = {
    dialogType,
    data,
  };
  const modalRef = await modalController.create({
    component: CustomPopupComponent,
    componentProps,
    animated: true,
    leaveAnimation: modalLeaveAnimation,
    backdropDismiss: true,
    keyboardClose: false,
    showBackdrop: true,
    swipeToClose: false,
    cssClass: ['custom-modal', `${action}-modal`],
  });
  await modalRef.present();
  return modalRef;
};
