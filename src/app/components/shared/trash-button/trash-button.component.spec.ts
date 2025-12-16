import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashButtonComponent } from './trash-button.component';

describe('TrashButtonComponent', () => {
  let component: TrashButtonComponent;
  let fixture: ComponentFixture<TrashButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrashButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
