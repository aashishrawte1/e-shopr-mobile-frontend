import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeQuizScreen1Page } from './welcome-quiz-screen1.page';

describe('WelcomeQuizScreen1Page', () => {
  let component: WelcomeQuizScreen1Page;
  let fixture: ComponentFixture<WelcomeQuizScreen1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeQuizScreen1Page],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeQuizScreen1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
