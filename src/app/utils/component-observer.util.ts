import { OnDestroy, Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  template: '',
})
export default class PageObserverComponent implements OnDestroy {
  private subPool: Subscription[] = [];
  constructor() {}
  observe<T>(
    subject: Observable<T>,
    onChange: (value: T) => void
  ): Subscription {
    const sub = subject.subscribe(onChange);
    this.subPool.push(sub);
    return sub;
  }
  ngOnDestroy() {
    this.subPool.forEach((sub) => sub.unsubscribe());
    this.subPool = [];
  }
}
