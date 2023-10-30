import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeQuizScreen3Page } from './welcome-quiz-screen3.page';

describe('WelcomeQuizScreen3Page', () => {
  let component: WelcomeQuizScreen3Page;
  let fixture: ComponentFixture<WelcomeQuizScreen3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeQuizScreen3Page],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeQuizScreen3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
