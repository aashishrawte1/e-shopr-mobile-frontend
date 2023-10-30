import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeQuizPage } from './welcome-quiz.page';

describe('WelcomeQuizPage', () => {
  let component: WelcomeQuizPage;
  let fixture: ComponentFixture<WelcomeQuizPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeQuizPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
