import { Component, Input, OnInit } from '@angular/core';
import { YOUTUBE_VIDEO_ID_MATCHER_REGEX } from '../../constants';

@Component({
  selector: 'user-portal-video-viewer-viewer',
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.scss'],
})
export class VideoViewerComponent implements OnInit {
  @Input() customData: { videoUrl: string };
  videoId: string;
  response: string;
  loader: HTMLIonLoadingElement;
  constructor() {}

  async ngOnInit() {
    this.videoId = this.getYouTubeVideoId(this.customData.videoUrl);
  }

  getYouTubeVideoId(url: string) {
    const ytRegex = YOUTUBE_VIDEO_ID_MATCHER_REGEX;
    const matchSet = url.match(ytRegex);
    if (matchSet && matchSet.length === 2) {
      return matchSet[1].trim();
    }
  }
}
