import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArticleViewerComponent } from './article-viewer.component';

describe('ArticleViewerComponent', () => {
  let component: ArticleViewerComponent;
  let fixture: ComponentFixture<ArticleViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleViewerComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
