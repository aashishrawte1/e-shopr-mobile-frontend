import { Observable, Subscription } from 'rxjs';

export class SubscriptionManager {
  private subPool: Array<Subscription> = [];
  constructor() {}
  manage<T>(subject: Observable<T>, onChange: (value: T) => void) {
    const sub = subject.subscribe(onChange);
    this.subPool.push(sub);
  }

  unsubscribeAll() {
    for (const sub of this.subPool) {
      sub.unsubscribe();
    }

    this.subPool = [];
    return true;
  }
}
