import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { PageRoutes } from '../../constants';
import { RoutingStateService } from '../../services/routing-state.service';
import { useSubject } from '../../utils/useSubject';

@Component({
  selector: 'user-portal-custom-progress-bar',
  templateUrl: './custom-progress-bar.component.html',
  styleUrls: ['./custom-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomProgressBarComponent implements OnChanges {
  @Input() progressIndicatorColor: string;
  @Input() progressBarFillPeriod = 10000;
  @ViewChild('outerProgressBarWidth', { static: false })
  outerProgressBar: ElementRef;

  @Output() barFilled: EventEmitter<boolean> = new EventEmitter();
  progressBarValue = useSubject<number>(0);
  progressUpdaterInterval: NodeJS.Timeout;

  constructor(private routingStateService: RoutingStateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.progressBarFillPeriod) {
      this.startProgressBarFilling();
    }
  }

  startProgressBarFilling() {
    if (this.progressUpdaterInterval) {
      clearInterval(this.progressUpdaterInterval);
    }

    const intervalPeriod = 10;
    const totalTicks = this.progressBarFillPeriod / intervalPeriod;
    const barFinalVal = 100;
    if (this.progressBarFillPeriod === 0) {
      this.progressBarValue.next(barFinalVal);
      return;
    }
    let count = 1;
    let fillPercent = 0;
    const incrementFactor = barFinalVal / totalTicks;
    this.progressUpdaterInterval = setInterval(() => {
      count++;
      fillPercent += incrementFactor;
      this.progressBarValue.next(fillPercent);
      if (count === totalTicks) {
        clearInterval(this.progressUpdaterInterval);
        this.progressBarValue.next(fillPercent);
        this.onBarFillComplete();
      }
    }, intervalPeriod);
  }

  async onBarFillComplete() {
    this.routingStateService.currentRoute
      .pipe(take(1))
      .subscribe((currentRoute) => {
        if (currentRoute?.url.includes(PageRoutes.fullUrls.productDetail)) {
          this.barFilled.emit(true);
        } else {
          this.progressBarValue.next(0);
          clearInterval(this.progressUpdaterInterval);
        }
      });
  }
}
