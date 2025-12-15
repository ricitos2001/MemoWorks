import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveButtonComponent } from './remove-button.component';

describe('RemoveButtonComponent', () => {
  let component: RemoveButtonComponent;
  let fixture: ComponentFixture<RemoveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
