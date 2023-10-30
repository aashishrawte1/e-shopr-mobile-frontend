import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-circular-progress-bar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.scss'],
})
export class CircularProgressBarComponent
  extends PageObserverComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() progressBarColor: string;
  @Input() fillBar: boolean;
  @Input() triggeredAt: number; // timestamp
  @Input() requiredTriggerCount: number;
  @Input() duration: number;
  @Input() imageSrc: string;
  @Input() progressBarHint: string;
  @ViewChild('circle', { static: true }) circle: ElementRef<SVGCircleElement>;

  @Output() barFilled: EventEmitter<boolean> = new EventEmitter();
  @Output() currentProgress: EventEmitter<number> = new EventEmitter();

  circleSize = 44;
  circleStrokeWidth = 4;
  circleRadius = (this.circleSize - this.circleStrokeWidth) / 2;
  circleCircumference = this.circleRadius * 2 * Math.PI;
  numberOfTriggersReceived = 0;
  numberOfTimesTimerRan = 0;
  timerIsActive = false;
  eachTimerDuration: number;
  eachTriggerTotalPercentValue: number; // like each trigger accounts for 20% or 25%
  currentProgressPercent: number;
  progressUpdaterInterval: NodeJS.Timeout;
  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fillBar?.currentValue === true) {
      this.setProgress(100);
      return;
    }
    if (
      changes.triggeredAt?.currentValue &&
      changes.triggeredAt?.previousValue !== changes.triggeredAt.currentValue
    ) {
      this.eachTimerDuration =
        (this.duration / 1000 / this.requiredTriggerCount) * 1000;
      this.eachTriggerTotalPercentValue = 100 / this.requiredTriggerCount;
      if (this.fillBar) {
        this.setProgress(100);
        return;
      }
      this.numberOfTriggersReceived++;
      this.startProgress();
    }
  }

  startProgress() {
    if (this.timerIsActive) {
      return;
    }
    const startTimer = () => {
      this.timerIsActive = true;
      this.numberOfTimesTimerRan += 1;
      const interval =
        this.eachTimerDuration / this.eachTriggerTotalPercentValue;
      let passedDuration = 0;

      this.progressUpdaterInterval = setInterval(() => {
        passedDuration += interval;

        this.currentProgressPercent =
          ((this.numberOfTimesTimerRan - 1) * this.eachTimerDuration +
            passedDuration) /
          100;

        this.setProgress(this.currentProgressPercent);
        if (passedDuration === this.eachTimerDuration) {
          onTimerFinish();
        }
      }, interval);
    };

    const onTimerFinish = async () => {
      this.timerIsActive = false;
      clearInterval(this.progressUpdaterInterval);
      if (this.currentProgressPercent >= 100) {
        if (!this.fillBar) {
          this.barFilled.emit(true);
        }
        return;
      }

      if (this.numberOfTriggersReceived <= this.numberOfTimesTimerRan) {
        return;
      }

      startTimer();
    };

    startTimer();
  }

  setProgress(percent: number) {
    if (!this.circle) {
      return;
    }
    if (percent > 100) {
      return;
    }
    const offset =
      this.circleCircumference - (percent / 100) * this.circleCircumference;
    this.circle.nativeElement.style.strokeDashoffset = `${offset}`;
    this.currentProgress.emit(percent);
  }

  ngOnDestroy() {
    clearInterval(this.progressUpdaterInterval);
  }
}
