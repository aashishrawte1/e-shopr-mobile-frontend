import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController, NavController } from '@ionic/angular';
import { config } from 'rxjs';
import { CustomModalComponent } from '../../../components/custom-modal/custom-modal.component';
import { VideoViewerComponent } from '../../../components/video-viewer/video-viewer.component';
import { PageRoutes } from '../../../constants';
import { ActiveFilterItem } from '../../../models';
import { IPlaygroundPage, ISegmentData } from '../../../models/app-data.model';
import { AppService } from '../../../services/app.service';
import { ProductFetcherService } from '../../../services/product-fetcher.service';
import { StaticAssetService } from '../../../services/static-asset.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';
import { useSubject } from '../../../utils/useSubject';
import { SpinTheWheelService } from './spin-the-wheel.service';
import { SpinWheelReward } from './wheel-reward.interface';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let Winwheel: any;

@Component({
  selector: 'user-portal-game',
  templateUrl: './spin-the-wheel.page.html',
  styleUrls: ['./spin-the-wheel.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinTheWheelComponent
  extends PageObserverComponent
  implements OnInit {
  readonly allSpinsUsedText =
    'No more spin left for today.\n Try again tomorrow!';
  totalSpin: number;
  wheelSegments: ISegmentData[];
  wheelRef: any;
  wheelSpinning = false;
  mute = true;
  pageConfig: IPlaygroundPage;
  merchants: ActiveFilterItem[] = [];
  constructor(
    public asset: StaticAssetService,
    private appService: AppService,
    private modalController: ModalController,
    private spinWheelService: SpinTheWheelService,
    private productService: ProductFetcherService,
    private cdr: ChangeDetectorRef,
    private navController: NavController,
    private storeService: StoreService
  ) {
    super();
  }
  async ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (c) => {
      this.pageConfig = c.componentData.playgroundPage;
      this.cdr.detectChanges();
    });

    this.observe(this.storeService.json.playgroundData, (c) => {
      this.wheelSegments = c.spinTheWheel.wheelSegments;
      this.setupWheel();
      this.cdr.detectChanges();
    });
  }

  setupWheel() {
    const audio = new Audio('assets/sounds/tick.mp3');
    const playSound = () => {
      if (this.mute) {
        return;
      }

      // Stop and rewind the sound if it already happens to be playing.
      audio.pause();
      audio.currentTime = 0; // Play the sound.
      audio.play();
    };

    const alertPrize = (indicatedSegment: ISegmentData) => {
      this.wheelSpinning = false;
      const reward: SpinWheelReward = {
        action: indicatedSegment.data.action,
        text: indicatedSegment.text,
        table: indicatedSegment.data.table,
        tags: indicatedSegment.data.tags,
      };

      // Do the Action.
      this.spinWheelService.saveSpinReward(reward);
      this.performAction(reward);
    };
    const wheelConfig = {
      canvasId: 'spinWheel',
      outerRadius: 170, // The size of the wheel.
      innerRadius: 40,
      lineWidth: 4,
      strokeStyle: 'black',
      textFillStyle: 'white',
      textFontSize: 14,
      numSegments: 8,
      segments: this.wheelSegments,
      animation: {
        type: 'spinToStop',
        direction: 'clockwise',
        propertyName: 'rotationAngle',
        duration: 8,
        spins: 4,
        callbackFinished: alertPrize,
        callbackSound: playSound, // Called when the tick sound is to be played.
        soundTrigger: 'pin', // Specify pins are to trigger the sound.
      },

      // Turn pins on.
      pins: {
        number: 8,
        fillStyle: 'silver',
        outerRadius: 0,
      },
    };
    this.wheelRef = new Winwheel(wheelConfig);
    this.cdr.detectChanges();
  }

  spinTheWheel() {
    const resetWheel = () => {
      this.wheelRef.stopAnimation(false);
      this.wheelRef.rotationAngle = 0;
      this.wheelRef.draw();
      this.wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
    };
    // Ensure that spinning can't be clicked again while already running.
    if (this.wheelSpinning === false) {
      resetWheel();
      this.wheelRef.startAnimation();
      this.wheelSpinning = true;
    }
  }

  async performAction(reward: SpinWheelReward) {
    await this.appService.showLoader();
    if (reward.action === 'filterByTags') {
      this.navController.navigateForward(PageRoutes.fullUrls.mixedContent, {
        state: reward,
      });
    }
    if (reward.action === 'read') {
      const articles = this.storeService.articles.getValue();
      const article = articles[Math.floor(Math.random() * articles.length)];
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { Browser } = Plugins;
      Browser.open({
        url: article.url,
        windowName: '_blank',
      });
    }
    if (reward.action === 'merchant') {
      await this.productService.fetchMerchantList().then((merchantList) => {
        this.merchants = merchantList;
      });
      const randomMerchant = await this.appService.getRandomItems(
        this.merchants,
        100
      )[0];

      this.navController.navigateForward(PageRoutes.fullUrls.market, {
        state: {
          activeFilter: { ...randomMerchant, selected: true },
        },
      });
    }
    if (reward.action === 'video') {
      const playGroundItems = this.storeService.json.playgroundData.value
        .playGroundSectionItems;
      const videoItems = playGroundItems.filter(
        (item: { action: string }) => item.action === 'video'
      );
      const randomVideo =
        videoItems[Math.floor(Math.random() * videoItems.length)];
      const modalRefSub = useSubject<HTMLIonModalElement>(null);

      const componentProps = {
        modalRefSub,
        data: {
          videoUrl: randomVideo?.data?.videoUrl,
        },
        componentToLoad: VideoViewerComponent,
      };

      const modalRef = await this.modalController.create({
        component: CustomModalComponent,
        componentProps,
        backdropDismiss: false,
        cssClass: ['full-page-modal'],
      });
      modalRefSub.next(modalRef);
      await modalRef.present();
    }
  }

  goBack() {
    this.navController.navigateBack('app/tabs/home');
  }

  toggleSound() {
    this.mute = !this.mute;
  }
}
