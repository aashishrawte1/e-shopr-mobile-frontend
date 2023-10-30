import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PassionWavePageComponent } from './passion-wave.page';

describe('PassionWavePage', () => {
  let component: PassionWavePageComponent;
  let fixture: ComponentFixture<PassionWavePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PassionWavePageComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PassionWavePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
