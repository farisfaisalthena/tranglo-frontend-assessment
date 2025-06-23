import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectionModalComponent } from './currency-selection-modal.component';

describe('CurrencySelectionModalComponent', () => {
  let component: CurrencySelectionModalComponent;
  let fixture: ComponentFixture<CurrencySelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencySelectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencySelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
