import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { DynamicComponentHostDirective } from '../../directives/dynamic-component-host.directive';
import PageObserverComponent from '../../utils/component-observer.util';
import { useSubject } from '../../utils/useSubject';

@Component({
  selector: 'user-portal-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomModalComponent
  extends PageObserverComponent
  implements OnInit {
  @Input() modalRefSub = useSubject<HTMLIonModalElement>(null);
  @Input() componentToLoad;
  @Input() data: any;
  @ViewChild(DynamicComponentHostDirective, { static: true })
  hostDirective: DynamicComponentHostDirective;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.componentToLoad
    );
    const viewContainerRef = this.hostDirective.viewContainerRef;
    viewContainerRef.clear();

    const cmpRef = viewContainerRef.createComponent(componentFactory);
    (cmpRef.instance as any).customData = this.data || {};

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe((_) => this.modalRefSub.getValue().dismiss());
  }

  dismissModal() {
    this.modalRefSub.getValue().dismiss();
  }
}
