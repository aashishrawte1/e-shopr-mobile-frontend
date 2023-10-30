import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeQuizScreen4PageComponent } from './welcome-quiz-screen4.page';

describe('WelcomeQuizScreen4Page', () => {
  let component: WelcomeQuizScreen4Page;
  let fixture: ComponentFixture<WelcomeQuizScreen4Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeQuizScreen4Page],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeQuizScreen4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
