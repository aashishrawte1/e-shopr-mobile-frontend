import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchResultPageComponent } from './search-result.page';

describe('SearchResultPage', () => {
  let component: SearchResultPageComponent;
  let fixture: ComponentFixture<SearchResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultPageComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
