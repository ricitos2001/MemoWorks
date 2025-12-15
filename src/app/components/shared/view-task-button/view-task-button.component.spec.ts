import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskButtonComponent } from './view-task-button.component';

describe('ViewTaskButtonComponent', () => {
  let component: ViewTaskButtonComponent;
  let fixture: ComponentFixture<ViewTaskButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTaskButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTaskButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
