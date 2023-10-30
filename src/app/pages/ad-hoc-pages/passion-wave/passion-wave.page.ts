import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IonContent, NavController } from '@ionic/angular';
import { endpoints } from '../../../constants/endpoints';
import { ApiResponse } from '../../../models';
import { AppService } from '../../../services/app.service';
import { RequestService } from '../../../services/request.service';
import { StoreService } from '../../../services/store.service';
import { Plugins } from '@capacitor/core';
import { AppShareService } from '../../../services/app-share.service';
import { StaticAssetService } from '../../../services/static-asset.service';
import { gtmEventNames } from '../../../models/gtm-event.model';
import { CustomGoogleTagManagerService } from '../../../services/custom-google-tag-manager.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';
import { url } from 'inspector';
import { HttpClient } from '@angular/common/http';
export interface IPAWaveStats {
  email: string;
  weight: number;
  kykdistance: number;
  supdistance: number;
  totalPoints: string;
  teamName: string;
}

export interface TPAWaveStats {
  email: string;
  teamName: string;
  totalPoints: string;
  weight: number;
  kykdistance: number;
  supdistance: number;
}

export interface Top10Team {
  teamName: string;
  totalPoints: number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const { App, Share } = Plugins;
@Component({
  selector: 'user-portal-passion-wave',
  templateUrl: './passion-wave.page.html',
  styleUrls: ['./passion-wave.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassionWavePageComponent implements OnInit {
  @ViewChild('ionContent', { static: true }) ionContent: IonContent;

  myStats: IPAWaveStats;
  myTeamStats: TPAWaveStats;
  top10Team: Top10Team;

  ionContentDimensions: { width: number; height: number };
  display: any = [];
  displayIndividualHistory = false;
  displayTeamStats = false;

  public chartArea: Object = {
    border: {
      width: 0,
    },
  };

  constructor(
    private navController: NavController,
    public storeService: StoreService,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private requestService: RequestService,
    private appService: AppService,
    private appShareService: AppShareService,
    public assetService: StaticAssetService,
    private gtmService: CustomGoogleTagManagerService,
    private userProfileService: UserProfileService,
    private http: HttpClient
  ) {}

  async ionViewWillEnter() {
    const ionContentDimensions = (this
      .ionContent as any).el.getBoundingClientRect();
    this.ionContentDimensions = this.ionContentDimensions || ({} as any);
    this.ionContentDimensions.width = ionContentDimensions.width;

    // await this.http
    //   .get(endpoints.getUserStatForPWAEvent2021)
    //   .subscribe((response) => {
    //     console.log(response);
    //   });

    const Istats = (
      await this.requestService.send<ApiResponse>(
        'GET',
        endpoints.getUserStatForPWAEvent2021
      )
    ).result as IPAWaveStats;

    console.log(Istats);

    if (!!(Istats?.email && Istats?.weight)) {
      this.myStats = {
        ...Istats,
      };
    }

    const Tstats = (
      await this.requestService.send<ApiResponse>(
        'GET',
        endpoints.getTeamStatForPWAEvent2021
      )
    ).result as TPAWaveStats;

    console.log(Tstats);

    if (!!(Tstats?.email && Tstats?.weight)) {
      this.myTeamStats = {
        ...Tstats,
      };
    }

    const Cstats = (
      await this.requestService.send<ApiResponse>(
        'GET',
        endpoints.getTop10TeamStatForPWAEvent20
      )
    ).result as Top10Team;

    console.log(Cstats);

    if (!!(Cstats?.teamName && Cstats?.totalPoints)) {
      this.top10Team = {
        ...Cstats,
      };
    }

    this.cdr.detectChanges();
  }

  async ngOnInit() {}

  // horizontal bar graph starts here

  //Initializing Chart Width
  public width: string = Browser.isDevice ? '100%' : '80%';
  public data: Object[] = [
    { x: 'Vic test', y: 1500 },
    { x: 'Aashishers', y: 75 },
    { x: 'PrimePrem', y: 42 },
    { x: 'Supergirl', y: 27 },
    { x: 'Team Fun', y: 22 },
    { x: 'Carolitos', y: 125 },
    { x: 'Titanes', y: 47 },
    { x: 'Eric Team', y: 25 },
    { x: 'Camilitas', y: 29 },
    { x: 'Team extreme', y: 28 },
  ];

  //Initializing Marker
  public marker: Object = {
    dataLabel: {
      visible: true,
      position: 'Top',
      font: {
        fontWeight: '600',
        color: '#ffffff',
      },
    },
  };
  //Initializing Primary X Axis
  public primaryXAxis: Object = {
    valueType: 'Category',
    interval: 1,
    width: 0,
    majorGridLines: { width: 0 },
  };
  //Initializing Primary Y Axis
  public primaryYAxis: Object = {
    labelFormat: '{value}',
    edgeLabelPlacement: 'Shift',
    majorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    lineStyle: { width: 0 },
    labelStyle: {
      color: 'transparent',
    },
  };
  public tooltip: Object = {
    enable: true,
  };
  // custom code start
  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(
      (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(
        /-dark/i,
        'Dark'
      )
    );
  }

  // horizontal bar graph ends here

  doRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
      this.cdr.detectChanges();
    }, 2000);
  }

  async addProfilePicture() {
    this.userProfileService.addProfilePicture().then((_) => {
      try {
        this.gtmService.recordEvent({
          event: gtmEventNames.profilePictureChanged,
        });
      } catch (error) {}
    });
  }

  getSanitizeIframeUrl({ url }: { url: string }) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack() {
    this.navController.back();
  }

  openSignUpForm() {
    this.appService.openInAppBrowser({
      url: 'https://go.gov.sg/pnk2021',
    });
  }

  toggleDetail(idx: number) {
    this.display[idx] = !this.display[idx];
  }

  toggleIndividualHistory() {
    this.displayIndividualHistory = !this.displayIndividualHistory;
  }

  toggleTeamStats() {
    this.displayTeamStats = !this.displayTeamStats;
  }
}
